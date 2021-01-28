import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import detectEthereumProvider from "@metamask/detect-provider";
import { environment } from "src/environments/environment";
import Web3 from 'web3';


@Component({
  selector: "app-swap-chx",
  templateUrl: "./swap-chx.component.html",
  styleUrls: ["./swap-chx.component.css"],
})
export class SwapChxComponent implements OnInit {
  acceptSwapForm: FormGroup;
  swapForm: FormGroup;
  provider: any;
  currentAccount: any;

  loading = false;
  risksAccepted = false;
  showWarning = false;
  warningMessage: string;

  web3: any;
  wChxMapping: any;
  wChxToken: any;

  ethAddrMapped = false;
  wChxBalance: number;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.acceptSwapForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.swapForm = this.fb.group({
      ethAddress: [null],
      fromBlockchain: ["chx"],
      toBlockchain: ["eth"],
      fromAmount: [0],
      toAmount: [0],
    });

   this.swapForm.get('fromBlockchain').valueChanges.subscribe(value => {
     if (value === this.swapForm.get('toBlockchain').value) {
       this.swapForm.get('toBlockchain').value === 'eth' ? this.swapForm.get('toBlockchain').setValue('chx') : this.swapForm.get('toBlockchain').setValue('eth');
     }
   });

   this.swapForm.get('toBlockchain').valueChanges.subscribe(value => {
    if (value === this.swapForm.get('fromBlockchain').value) {
      this.swapForm.get('fromBlockchain').value === 'eth' ? this.swapForm.get('fromBlockchain').setValue('chx') : this.swapForm.get('fromBlockchain').setValue('eth');
    }
  });


  }

  swapBlockchains() {
    if (this.swapForm.get("fromBlockchain").value === "eth") {
      this.swapForm.get("fromBlockchain").setValue("chx");
    } else {
      this.swapForm.get("fromBlockchain").setValue("eth");
    }
  }

  async acceptRisks() {
    this.loading = true;
    const provider = await detectEthereumProvider();

    if (provider) {
      console.log("metamask installed");
      if (provider !== window.ethereum) {
        console.error("Do you have multiple wallets installed?");
        this.showWarning = true;
        this.warningMessage = `Please check if you have other wallet installed and active besides MetaMask wallet`;
        this.loading = false;
      } else {

        this.provider = provider;
        this.web3 = new Web3(this.provider);

        this.wChxMapping = new this.web3.eth.Contract(
          environment.wChxMappingABI,
          environment.wChxMappingContract
        );

        this.wChxToken = new this.web3.eth.Contract(
          environment.wChxTokenABI,
          environment.wChxTokenContract
        );

        const ethAddr = await this.wChxMapping.methods.ethAddress(
          "CHcBVLtTuY393fSAZfwMERpkwBJfzuYva3Q"
        ).call();

        if (ethAddr) {
          this.ethAddrMapped = true;
          this.swapForm.get('ethAddress').setValue(ethAddr);
          this.swapForm.get('ethAddress').disable();
          this.wChxBalance = await this.wChxToken.methods.balanceOf(ethAddr).call();
          const minAmount = await this.wChxToken.methods.minSwapAmount().call() / Math.pow(10, 7);
          console.log('minAmount', minAmount);
          console.log('balance', this.wChxBalance)
        }

  

        console.log(ethAddr);
        this.risksAccepted = true;
        this.loading = false;
      }
    } else {
      this.showWarning = true;
      this.warningMessage = `Please install <a href="https://metamask.io/download.html" target="_blank">MetaMask browser extension</a> before using <strong>CHX Bridge</strong> functionality.`;
      this.loading = false;
    }
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
      this.showWarning = true;
      this.warningMessage = `Your MetaMask wallet is locked or you didn't connect any accounts.`;
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      // Do any other work!
    }
  }

  connect() {
    this.provider
      .request({ method: "eth_requestAccounts" })
      .then(this.handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
          this.showWarning = true;
          this.warningMessage = `You have rejected to connect WeOwn wallet with your MetaMask wallet.`;
        } else {
          console.error(err);
        }
      });
  }

  reset() {
    this.acceptSwapForm.reset();
    this.swapForm.reset();
    this.risksAccepted = false;
    this.showWarning = false;
    this.warningMessage = null;
  }
}
