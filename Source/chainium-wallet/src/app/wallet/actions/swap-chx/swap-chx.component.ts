import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import detectEthereumProvider from "@metamask/detect-provider";
import { Subscription } from "rxjs";
import { TxResult } from "src/app/shared/models/submit-transactions.model";
import { WalletInfo } from "src/app/shared/models/wallet-info.model";
import { CryptoService } from "src/app/shared/services/crypto.service";
import { NodeService } from "src/app/shared/services/node.service";
import { PrivatekeyService } from "src/app/shared/services/privatekey.service";
import { environment } from "src/environments/environment";
import Web3 from "web3";
declare var ownBlockchainSdk: any;

@Component({
  selector: "app-swap-chx",
  templateUrl: "./swap-chx.component.html",
  styleUrls: ["./swap-chx.component.css"],
})
export class SwapChxComponent implements OnInit, OnDestroy {
  acceptWrapForm: FormGroup;
  wrapForm: FormGroup;
  txSub: Subscription;
  provider: any;
  currentAccount: any;
  addressSub: Subscription;
  signatureSub: Subscription;

  loading = false;
  risksAccepted = false;
  metaMaskConnected = false;
  connectingToMetaMask = false;
  confirmTransfer = false;
  showWarning = false;
  warningMessage: string;
  isProduction: boolean;
  inProgress = false;

  isKeyImported = false;
  txResult: TxResult;
  wallet: WalletInfo;

  web3: any;
  chainId: string;
  wChxMapping: any;
  wChxToken: any;

  ethAddrMapped = false;
  chxAddress: string;
  ethAddress: string;
  chxBalance: number;
  wChxBalance: number;
  minWrapAmount: number;
  nonce: number;
  fee: number;

  chains = {
    "0x1": "Ethereum Main Network",
    "0x3": "Ropsten Test Network",
    "0x4": "Rinkeby Test Network",
    "0x5": "Goerli Test Network",
    "0x2a": "Kovan Test Network",
  };

  constructor(
    private fb: FormBuilder,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
    this.chxAddress = this.wallet.address;

    this.addressSub = this.nodeService
      .getAddressInfo(this.wallet.address)
      .subscribe((balInfo) => {
        this.chxBalance = balInfo.balance.available;
        this.nonce = balInfo.nonce + 1;
        this.fee = this.nodeService.getMinFee();
        this.setupForms();
      });
  }

  ngOnDestroy(): void {
    if (this.addressSub) this.addressSub.unsubscribe();
    if (this.signatureSub) this.signatureSub.unsubscribe();
    if (this.txSub) this.txSub.unsubscribe();
  }

  setupForms() {
    this.acceptWrapForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.wrapForm = this.fb.group({
      ethAddress: [null],
      fromBlockchain: ["chx"],
      toBlockchain: ["eth"],
      fromAmount: [null],
      toAmount: [null],
    });

    this.wrapForm.get("fromAmount").disable();

    this.wrapForm.get("fromBlockchain").valueChanges.subscribe((value) => {
      if (value === this.wrapForm.get("toBlockchain").value) {
        this.wrapForm.get("toBlockchain").value === "eth"
          ? this.wrapForm.get("toBlockchain").setValue("chx")
          : this.wrapForm.get("toBlockchain").setValue("eth");
        this.setValidators();
      }
    });

    this.wrapForm.get("toBlockchain").valueChanges.subscribe((value) => {
      if (value === this.wrapForm.get("fromBlockchain").value) {
        this.wrapForm.get("fromBlockchain").value === "eth"
          ? this.wrapForm.get("fromBlockchain").setValue("chx")
          : this.wrapForm.get("fromBlockchain").setValue("eth");
        this.setValidators();
      }
    });

    this.wrapForm.get("fromAmount").valueChanges.subscribe((value) => {
      this.wrapForm.get("toAmount").setValue(value);
    });
  }

  setValidators() {
    this.wrapForm
      .get("fromAmount")
      .setValidators([
        Validators.required,
        Validators.min(this.minWrapAmount),
        Validators.max(
          this.fromBlockchain === "chx" ? this.chxBalance : this.wChxBalance
        ),
      ]);
  }

  get fromBlockchain(): string {
    return this.wrapForm.get("fromBlockchain").value;
  }

  get toBlockchain(): string {
    return this.wrapForm.get("toBlockchain").value;
  }

  get chainName(): string {
    return this.chains[this.chainId];
  }

  swapBlockchains() {
    if (this.wrapForm.get("fromBlockchain").value === "eth") {
      this.wrapForm.get("fromBlockchain").setValue("chx");
    } else {
      this.wrapForm.get("fromBlockchain").setValue("eth");
    }
  }

  async acceptRisks() {
    this.risksAccepted = true;
  }

  async initiateMetaMaskProvider() {
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
        this.chainId = this.provider.chainId;
        this.isProduction = this.chainId === "0x1";

        // Reload window if network has been changed in MetaMask
        await this.provider.on("chainChanged", (chainId: string) =>
          window.location.reload()
        );

        this.wChxMapping = new this.web3.eth.Contract(
          environment.wChxMappingABI,
          environment.wChxMappingContract
        );

        this.wChxToken = new this.web3.eth.Contract(
          environment.wChxTokenABI,
          environment.wChxTokenContract
        );

        this.connect();
      }
    } else {
      this.showWarning = true;
      this.warningMessage = `Please install <a href="https://metamask.io/download.html" target="_blank">MetaMask browser extension</a> before using <strong>CHX Bridge</strong> functionality.`;
      this.loading = false;
    }
  }

  connect() {
    this.connectingToMetaMask = true;
    this.provider
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => await this.syncAccounts(accounts))
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

  async syncAccounts(accounts: string[]) {
    this.loading = false;
    this.metaMaskConnected = true;
    this.connectingToMetaMask = false;
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
      this.showWarning = true;
      this.warningMessage = `Your MetaMask wallet is locked or you didn't connect any accounts.`;
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      this.ethAddress = this.currentAccount;

      const ethAddr = await this.wChxMapping.methods
        .ethAddress(this.chxAddress)
        .call();

      if (
        ethAddr !== "0x0000000000000000000000000000000000000000" &&
        ethAddr !== ""
      ) {
        this.ethAddrMapped = true;
        if (ethAddr.toLowerCase() !== accounts[0]) {
          this.showWarning = true;
          this.warningMessage = `Your current CHX address is already mapped to ${ethAddr} please check if in your MetaMask currently selected account is ${ethAddr} and try again.`;
          return;
        } else {
          this.ethAddress = ethAddr;
        }
      } else {
        this.ethAddrMapped = false;
      }

      this.wChxBalance =
        (await this.wChxToken.methods.balanceOf(this.ethAddress).call()) /
        Math.pow(10, 7);

      this.minWrapAmount =
        (await this.wChxToken.methods.minWrapAmount().call()) / Math.pow(10, 7);

      this.wrapForm.get("fromAmount").enable();
      this.setValidators();
      this.wrapForm.get("fromAmount").setValue(0);
    }
  }

  wrap() {
    this.loading = true;
    if (!this.ethAddrMapped) {
      this.signatureSub = this.cryptoService
        .signMessage(
          this.privateKeyService.getWalletInfo().privateKey,
          this.ethAddress
        )
        .subscribe(async (signature: string) => {
          const mapAddr = await this.wChxMapping.methods
            .mapAddress(this.chxAddress, signature)
            .send({
              from: this.ethAddress,
            });
          this.transfer();
        });
    } else {
      this.transfer();
    }
  }

  async transfer() {
    if (this.fromBlockchain === "chx") {
      const txToSign = ownBlockchainSdk.transactions.createTx(
        this.wallet.address,
        this.nonce,
        this.fee
      );

      txToSign.addTransferChxAction(
        environment.ownerChxAddress,
        +this.wrapForm.get("fromAmount").value
      );

      const signature = txToSign.sign(
        environment.networkCode,
        this.wallet.privateKey
      );

      this.txSub = this.nodeService
        .submitTransaction(signature)
        .subscribe((result) => {
          this.loading = false;
          if (result.errors) {
            this.showWarning = true;
            this.warningMessage = result.errors;
            return;
          }
          this.txResult = result as TxResult;
        });
    }
    if (this.fromBlockchain === "eth") {
      const amount = +this.wrapForm.get("fromAmount").value * Math.pow(10, 7);
      const tx = await this.wChxToken.methods
        .transfer(environment.ownerEthAddress, amount)
        .send({
          from: this.ethAddress,
        })
        .on("transactionHash", (hash) => {
          this.txResult = new TxResult();
          this.txResult.txHash = hash;
          this.inProgress = true;
          this.loading = false;
          console.log("hash", hash);
        })
        .on("receipt", (receipt) => {
          this.inProgress = false;
          console.log("receipt", receipt);
        })
        .on("error", (error, receipt) => {
          this.inProgress = false;
          this.showWarning = true;
          switch (error.code) {
            case 4001:
              this.warningMessage =
                "The transaction was rejected in MetaMask. The process was therefore cancelled and no tokens are transferred.";
              break;
            case -32602:
              this.warningMessage = `Check if your currently selected address in MetaMask is ${this.ethAddress} and try again.`;
            default:
              this.warningMessage = error.message;
          }
        });
    }
  }

  reset() {
    this.acceptWrapForm.reset();
    this.wrapForm.reset();
    this.risksAccepted = false;
    this.showWarning = false;
    this.warningMessage = null;
    this.loading = false;
    this.confirmTransfer = false;
    this.metaMaskConnected = false;
    this.inProgress = false;
  }
}
