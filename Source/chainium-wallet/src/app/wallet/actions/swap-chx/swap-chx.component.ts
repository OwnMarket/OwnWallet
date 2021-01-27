import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import detectEthereumProvider from "@metamask/detect-provider";

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
  shouldInstallMetamask = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.acceptSwapForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.swapForm = this.fb.group({
      fromCurrency: ["chx"],
      toCurrency: ["eth"],
      fromAmount: [0],
      toAmount: [0],
    });

    this.swapForm.valueChanges.subscribe((value) => {
      if (value.fromCurrency === value.toCurrency) {
        if (value.fromCurrency === "eth") {
          this.swapForm.get("toCurrency").setValue("chx");
        } else {
          this.swapForm.get("toCurrency").setValue("eth");
        }
      }
    });
  }

  swapBlockchains() {
    if (this.swapForm.get("fromCurrency").value === "eth") {
      this.swapForm.get("fromCurrency").setValue("chx");
    } else {
      this.swapForm.get("fromCurrency").setValue("eth");
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
        console.log(provider);
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
