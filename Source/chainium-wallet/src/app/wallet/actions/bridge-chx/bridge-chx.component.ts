import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TxResult } from 'src/app/shared/models/submit-transactions.model';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';
import { ChxBridgeFeeService } from 'src/app/shared/services/chx-bridge-fee.service';

import { BridgeFee } from 'src/app/shared/models/bridge-fee.model';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';

import { environment } from 'src/environments/environment';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-bridge-chx',
  templateUrl: './bridge-chx.component.html',
  styleUrls: ['./bridge-chx.component.css'],
})
export class BridgeChxComponent implements OnInit, OnDestroy {
  acceptBridgeForm: FormGroup;
  bridgeForm: FormGroup;

  provider: any;
  currentAccount: any;

  txSub: Subscription;
  addressSub: Subscription;
  signatureSub: Subscription;
  bridgeFeeSub: Subscription;

  loading = false;
  risksAccepted = false;
  metaMaskConnected = false;
  connectingToMetaMask = false;
  confirmTransfer = false;
  showWarning = false;
  warningMessage: string;
  isProduction: boolean;
  weOwnNet: boolean;
  inProgress = false;
  showFees = false;

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
  bridgeFee: BridgeFee;
  step: number = 1;

  chains = {
    '0x1': 'Ethereum Main Network',
    '0x3': 'Ropsten Test Network',
    '0x4': 'Rinkeby Test Network',
    '0x5': 'Goerli Test Network',
    '0x2a': 'Kovan Test Network',
  };

  constructor(
    private fb: FormBuilder,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService,
    private bridgeFeeService: ChxBridgeFeeService,
    private configService: ConfigurationService
  ) {}

  ngOnInit() {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
    this.chxAddress = this.wallet.address;
    this.weOwnNet = this.configService.config.isProduction;

    this.addressSub = this.nodeService.getAddressInfo(this.wallet.address).subscribe((balInfo) => {
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
    this.acceptBridgeForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.bridgeForm = this.fb.group({
      ethAddress: [null],
      fromBlockchain: ['chx'],
      toBlockchain: ['eth'],
      fromAmount: [null],
      toAmount: [null],
    });

    this.bridgeForm.get('fromBlockchain').valueChanges.subscribe((value) => {
      if (value === this.bridgeForm.get('toBlockchain').value) {
        this.bridgeForm.get('toBlockchain').value === 'eth'
          ? this.bridgeForm.get('toBlockchain').setValue('chx')
          : this.bridgeForm.get('toBlockchain').setValue('eth');
        this.setValidators();
        this.getBridgeFee(this.ethAddress);
      }
    });

    this.bridgeForm.get('toBlockchain').valueChanges.subscribe((value) => {
      if (value === this.bridgeForm.get('fromBlockchain').value) {
        this.bridgeForm.get('fromBlockchain').value === 'eth'
          ? this.bridgeForm.get('fromBlockchain').setValue('chx')
          : this.bridgeForm.get('fromBlockchain').setValue('eth');
        this.setValidators();
        this.getBridgeFee(this.ethAddress);
      }
    });

    this.bridgeForm.get('fromAmount').valueChanges.subscribe((value) => {
      let newValue = value ? value : 0;
      if (this.bridgeFee && value) {
        newValue = new Number((value - this.bridgeFee.totalFee).toFixed(7));
      }
      if (newValue < 0) {
        newValue = 0;
      }
      this.bridgeForm.get('toAmount').setValue(newValue);
    });
  }

  setValidators() {
    this.bridgeForm
      .get('fromAmount')
      .setValidators([
        Validators.required,
        Validators.min(this.minWrapAmount),
        Validators.max(
          this.fromBlockchain === 'chx' ? (this.chxBalance > 0 ? this.chxBalance - this.fee : 0.1) : this.wChxBalance
        ),
      ]);
  }

  get fromBlockchain(): string {
    return this.bridgeForm.get('fromBlockchain').value;
  }

  get toBlockchain(): string {
    return this.bridgeForm.get('toBlockchain').value;
  }

  get chainName(): string {
    return this.chains[this.chainId];
  }

  get maxAmount(): number {
    let balance: number;
    if (this.fromBlockchain === 'chx') {
      balance = this.chxBalance - this.fee;
    } else {
      balance = this.wChxBalance;
    }
    return balance;
  }

  get ownNet(): string {
    return this.weOwnNet ? 'Mainnet' : 'Testnet';
  }

  get ethNet(): string {
    return this.weOwnNet ? 'Mainnet' : 'Rinkeby';
  }

  setMaxAmount() {
    this.bridgeForm.get('fromAmount').setValue(this.maxAmount);
  }

  swapBlockchains() {
    if (this.bridgeForm.get('fromBlockchain').value === 'chx') {
      this.bridgeForm.get('fromBlockchain').setValue('eth');
    } else {
      this.bridgeForm.get('fromBlockchain').setValue('chx');
    }
    this.bridgeForm.get('fromAmount').setValue(0);
    this.bridgeForm.get('toAmount').setValue(0);
    this.bridgeForm.markAsPristine();
    this.getBridgeFee(this.ethAddress);
  }

  async acceptRisks() {
    this.risksAccepted = true;
    this.web3 = new Web3(Web3.givenProvider);
    this.initContracts();
    await this.checkIfAddressIsMapped();
    await this.getBalanceAndMinAmount();
  }

  async initiateMetaMaskProvider() {
    this.loading = true;
    const provider = await detectEthereumProvider();

    if (provider) {
      console.log('metamask installed');
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
        this.showWarning = true;
        this.warningMessage = `Please check if you have other wallet installed and active besides MetaMask wallet`;
        this.loading = false;
      } else {
        this.provider = provider;
        this.web3.setProvider(this.provider);
        this.chainId = await this.provider.request({ method: 'eth_chainId' });
        this.isProduction = this.chainId === '0x1';
        this.provider.on('chainChanged', this.handleChainChanged);
        this.provider.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
          } else if (accounts[0] !== this.currentAccount) {
            this.reset();
          }
        });
        this.connect();
      }
    } else {
      this.showWarning = true;
      this.warningMessage = `Please install <a href="https://metamask.io/download.html" target="_blank">MetaMask browser extension</a> before using <strong>CHX Bridge</strong> functionality.`;
      this.loading = false;
      this.step = 0;
    }
  }

  handleChainChanged(chainId: string) {
    window.location.reload();
  }

  networkIsValid(): boolean {
    if (this.weOwnNet && this.chainId === '0x1') {
      return true;
    } else if (!this.weOwnNet && this.chainId === '0x4') {
      return true;
    } else {
      return false;
    }
  }

  initContracts() {
    this.wChxMapping = new this.web3.eth.Contract(
      this.configService.config.wChxMappingABI,
      this.configService.config.wChxMappingContract
    );

    this.wChxToken = new this.web3.eth.Contract(
      this.configService.config.wChxTokenABI,
      this.configService.config.wChxTokenContract
    );
  }

  async checkIfEthAddressIsMappedToOtherChxAddress(ethAddress: string) {
    try {
      const chxAddr = await this.wChxMapping.methods.chxAddress(ethAddress).call();

      if (chxAddr !== '') {
        if (chxAddr !== this.chxAddress) {
          this.showWarning = true;
          this.warningMessage =
            'Currently selected ETH Address has been already mapped to other CHX Address, please select other account in your MetaMask and try again.';
          this.step = 0;
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } catch (error) {
      this.showWarning = true;
      this.warningMessage = `Please check if your currently selected network in MetaMask is ${this.ethNet}. Change currently selected network in MetaMask to ${this.ethNet} and try again.`;
      this.step = 0;
      return false;
    }
  }

  async checkIfAddressIsMapped() {
    try {
      const ethAddr = await this.wChxMapping.methods.ethAddress(this.chxAddress).call();

      if (ethAddr !== '0x0000000000000000000000000000000000000000' && ethAddr !== '') {
        this.ethAddrMapped = true;
        this.ethAddress = ethAddr;
        this.getBridgeFee(this.ethAddress);
        this.step = 3;
      } else {
        this.ethAddrMapped = false;
        this.step = 2;
      }
    } catch (error) {
      this.showWarning = true;
      this.warningMessage = `Please check if your currently selected network in MetaMask is ${this.ethNet}. Change currently selected network in MetaMask to ${this.ethNet} and try again.`;
      this.step = 0;
    }
  }

  async getBalanceAndMinAmount() {
    try {
      if (this.ethAddrMapped && this.ethAddress) {
        this.wChxBalance = (await this.wChxToken.methods.balanceOf(this.ethAddress).call()) / Math.pow(10, 7);
        this.minWrapAmount = (await this.wChxToken.methods.minWrapAmount().call()) / Math.pow(10, 7);
        this.setValidators();
      }
    } catch (error) {
      this.showWarning = true;
      this.warningMessage = error;
      this.step = 0;
    }
  }

  getBridgeFee(ethAddress: string) {
    const type = this.fromBlockchain === 'chx' ? 'chxToEth' : 'ethToChx';
    this.bridgeFeeSub = this.bridgeFeeService.getBridgeFees(ethAddress, type).subscribe((resp) => {
      this.bridgeFee = resp.data;
    });
  }

  connect() {
    this.connectingToMetaMask = true;
    if (this.step !== 3) {
      this.step = 1.5;
    }
    this.provider
      .request({ method: 'eth_requestAccounts' })
      .then(async (accounts: string[]) => await this.syncAccounts(accounts))
      .catch((err: any) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
          this.showWarning = true;
          this.warningMessage = `You have rejected to connect WeOwn wallet with your MetaMask wallet.`;
          this.step = 0;
        } else {
          this.showWarning = true;
          this.warningMessage = err;
          this.step = 0;
        }
        this.loading = false;
      });
  }

  async syncAccounts(accounts: string[]) {
    this.loading = false;
    this.metaMaskConnected = true;
    this.connectingToMetaMask = false;
    if (this.step !== 3) {
      this.step = 2;
    }
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      this.showWarning = true;
      this.warningMessage = `Your MetaMask wallet is locked or you didn't connect any accounts.`;
      this.step = 0;
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      if (this.ethAddrMapped) {
        if (this.ethAddress.toLowerCase() !== this.currentAccount) {
          this.showWarning = true;
          this.warningMessage = `Please make sure that the address you connect to matches the ${this.ethAddress} in MetaMask. Then re-establish the connection.`;
          this.step = 0;
          return;
        } else {
          this.ethAddress = this.currentAccount;
        }
      } else {
        if (await this.checkIfEthAddressIsMappedToOtherChxAddress(this.currentAccount)) {
          this.ethAddress = this.currentAccount;
        }
      }
    }
  }

  mapAddress() {
    this.loading = true;
    if (!this.ethAddrMapped) {
      this.signatureSub = this.cryptoService
        .signMessage(this.privateKeyService.getWalletInfo().privateKey, this.ethAddress)
        .subscribe(async (signature: string) => {
          try {
            await this.wChxMapping.methods
              .mapAddress(this.chxAddress, signature)
              .send({
                from: this.ethAddress,
              })
              .on('transactionHash', (hash) => {
                this.txResult = new TxResult();
                this.txResult.txHash = hash;
                this.inProgress = true;
                this.loading = false;
                this.step = 2.5;
              })
              .on('receipt', (receipt) => {
                this.inProgress = false;
                this.txResult = null;
                this.getBalanceAndMinAmount();
                this.getBridgeFee(this.ethAddress);
                this.ethAddrMapped = true;
                this.step = 3;
              });
          } catch (error) {
            this.loading = false;
            this.showWarning = true;
            this.warningMessage = error.message;
            this.step = 0;
          }
        });
    }
  }

  async transfer() {
    if (this.fromBlockchain === 'chx') {
      const txToSign = ownBlockchainSdk.transactions.createTx(this.wallet.address, this.nonce, this.fee);

      txToSign.addTransferChxAction(
        this.configService.config.ownerChxAddress,
        +this.bridgeForm.get('fromAmount').value
      );

      const signature = txToSign.sign(environment.networkCode, this.wallet.privateKey);

      this.txSub = this.nodeService.submitTransaction(signature).subscribe((result) => {
        this.loading = false;
        if (result.errors) {
          this.showWarning = true;
          this.warningMessage = result.errors;
          this.step = 0;
          return;
        }
        this.txResult = result as TxResult;
        this.step = 6;
      });
    }
    if (this.fromBlockchain === 'eth') {
      const amount = +this.bridgeForm.get('fromAmount').value * Math.pow(10, 7);
      await this.wChxToken.methods
        .transfer(this.configService.config.wChxTokenContract, amount)
        .send({
          from: this.ethAddress,
        })
        .on('transactionHash', (hash) => {
          this.txResult = new TxResult();
          this.txResult.txHash = hash;
          this.inProgress = true;
          this.loading = false;
          this.step = 5;
        })
        .on('receipt', (receipt) => {
          this.inProgress = false;
          this.step = 6;
        })
        .on('error', (error, receipt) => {
          this.inProgress = false;
          this.showWarning = true;
          switch (error.code) {
            case 4001:
              this.warningMessage =
                'The transaction was rejected in MetaMask. The process was therefore cancelled and no tokens are transferred.';
              this.step = 0;
              break;
            case -32602:
              this.warningMessage = `Check if your currently selected address in MetaMask is ${this.ethAddress} and try again.`;
              this.step = 0;
            default:
              this.warningMessage = error.message;
              this.step = 0;
          }
        });
    }
  }

  reset() {
    this.acceptBridgeForm.reset();
    this.bridgeForm.reset();
    this.risksAccepted = false;
    this.showWarning = false;
    this.warningMessage = null;
    this.loading = false;
    this.confirmTransfer = false;
    this.metaMaskConnected = false;
    this.inProgress = false;
    this.step = 1;
  }
}
