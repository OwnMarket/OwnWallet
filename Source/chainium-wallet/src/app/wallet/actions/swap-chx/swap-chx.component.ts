import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import detectEthereumProvider from "@metamask/detect-provider";
import { Subscription } from "rxjs";
import { TxResult } from "src/app/shared/models/submit-transactions.model";
import { WalletInfo } from "src/app/shared/models/wallet-info.model";
import { NodeService } from "src/app/shared/services/node.service";
import { PrivatekeyService } from "src/app/shared/services/privatekey.service";
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
  addressSub: Subscription;

  loading = false;
  risksAccepted = false;
  showWarning = false;
  warningMessage: string;

  isKeyImported = false;
  txResult: TxResult;
  wallet: WalletInfo;

  web3: any;
  wChxMapping: any;
  wChxToken: any;

  ethAddrMapped = false;
  chxBalance: number;
  wChxBalance: number;
  minSwapAmount: number;
  nonce: number;
  fee: number;

  constructor(
    private fb: FormBuilder,    
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService
  ) {}

  ngOnInit() {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }

    this.wallet = this.privateKeyService.getWalletInfo();

    this.addressSub = this.nodeService.getAddressInfo(this.wallet.address)
    .subscribe(balInfo => {
      this.chxBalance = balInfo.balance.available;
      this.nonce = balInfo.nonce + 1;
      this.fee = this.nodeService.getMinFee();
      this.setupForms();
    });
  }

  setupForms() {
    this.acceptSwapForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.swapForm = this.fb.group({
      ethAddress: [null],
      fromBlockchain: ["chx"],
      toBlockchain: ["eth"],
      fromAmount: [null],
      toAmount: [null],
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

  this.swapForm.get('fromAmount').valueChanges.subscribe(value => {
    this.swapForm.get('toAmount').setValue(value);
  })

  }

  get fromBlockchain(): string {
    return this.swapForm.get('fromBlockchain').value;
  }

  get toBlockchain(): string {
    return this.swapForm.get('toBlockchain').value;
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

        this.risksAccepted = true;
          this.connect();
      }
    } else {
      this.showWarning = true;
      this.warningMessage = `Please install <a href="https://metamask.io/download.html" target="_blank">MetaMask browser extension</a> before using <strong>CHX Bridge</strong> functionality.`;
      this.loading = false;
    }
  }

  connect() {
    this.provider
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        this.loading = false;
        if (accounts.length === 0) {
          console.log("Please connect to MetaMask.");
          this.showWarning = true;
          this.warningMessage = `Your MetaMask wallet is locked or you didn't connect any accounts.`;
        } else if (accounts[0] !== this.currentAccount) {
          this.currentAccount = accounts[0];
          console.log('account', this.currentAccount);
   
          const ethAddr = await this.wChxMapping.methods.ethAddress(
            this.currentAccount
          ).call();
    
          if (ethAddr !== '0x0000000000000000000000000000000000000000' && ethAddr !== '') {
            this.ethAddrMapped = true;
            this.swapForm.get('ethAddress').setValue(ethAddr);
            this.swapForm.get('ethAddress').disable();
            this.wChxBalance = await this.wChxToken.methods.balanceOf(ethAddr).call();
   
          } else {
            this.ethAddrMapped = false;
            this.swapForm.get('ethAddress').setValue(this.currentAccount);
            this.swapForm.get('ethAddress').disable();
            this.wChxBalance = await this.wChxToken.methods.balanceOf(this.currentAccount).call();
            console.log('balance', this.wChxBalance)
          }
    
          this.minSwapAmount = await this.wChxToken.methods.minSwapAmount().call() / Math.pow(10, 7);
          this.swapForm.get('fromAmount').setValidators([Validators.required, Validators.min(this.minSwapAmount)]);
          this.swapForm.markAsDirty();
    
        }
      })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
          this.showWarning = true;
          this.warningMessage = `You have rejected to connect WeOwn wallet with your MetaMask wallet.`;
        } else {
          console.error(err);
        }
        this.loading = false;
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
