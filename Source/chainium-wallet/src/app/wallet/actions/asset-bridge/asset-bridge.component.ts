import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subscription } from 'rxjs';

import {
  MetaMaskStatus,
  TxResult,
  WalletInfo,
  MetamaskService,
  NodeService,
  PrivatekeyService,
  BridgeFee,
  AssetBridgeService,
  BridgeAsset,
  ChxBridgeService,
  validateEthAddress,
} from 'src/app/shared';

@Component({
  selector: 'app-asset-bridge',
  templateUrl: './asset-bridge.component.html',
  styleUrls: ['./asset-bridge.component.css'],
})
export class AssetBridgeComponent implements OnInit, OnDestroy {
  acceptBridgeForm: FormGroup;
  assetBridgeForm: FormGroup;

  metaMaskStatus$: Observable<MetaMaskStatus>;
  txStatus$: Observable<string>;
  txResult$: Observable<TxResult>;

  isKeyImported: boolean;
  wallet: WalletInfo;
  chxAddress: string;
  chxBalance: number;
  balance: number;
  nativeBalance: number;
  minWrapAmount: number;
  nonce: number;
  fee: number;

  paramsSub: Subscription;
  addressSub: Subscription;
  bridgeFeeSub: Subscription;
  transferSub: Subscription;
  selectedAssetSub: Subscription;
  selectedAccSub: Subscription;
  toChainSub: Subscription;
  fromChainSub: Subscription;

  step: number = 1;
  risksAccepted: boolean = false;
  loading: boolean = false;
  showFee: boolean = false;
  showMapping: boolean = false;
  mappingAddresses: boolean = false;
  addressJustMapped: boolean = false;
  bridgeFee: BridgeFee;
  assetBridgeFee: any;

  accountHashFromParams: string;
  assetCodeFromParams: string;
  balanceFromParams: number;
  addressIsMapped: boolean;
  wrongNetwork: boolean;
  explorer: string;
  error: string;
  metaMaskAddress: string;

  chainName: string;
  accounts: string[] = [];
  assets: BridgeAsset[] = [];

  assetBridgeChains = [{ name: 'Ethereum', code: 'eth', token: 'ETH' }];

  chxBridgeChains = [
    { name: 'Ethereum', code: 'eth', token: 'ETH' },
    { name: 'Binance Smart Chain', code: 'bsc', token: 'BNB' },
  ];

  blockchains = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private metamask: MetamaskService,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private assetBridgeService: AssetBridgeService,
    private chxService: ChxBridgeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
    this.chxAddress = this.wallet.address;
    this.metaMaskStatus$ = this.metamask.status$;
    this.metaMaskAddress = this.metamask.currentAccount;
    this.txStatus$ = of('ready');
    this.initAcceptBridgeForm();

    this.paramsSub = this.activatedRoute.queryParams.subscribe((params) => {
      const { accountHash, assetCode, balance } = params;
      this.accountHashFromParams = accountHash || null;
      this.assetCodeFromParams = assetCode || null;
      this.balanceFromParams = +balance || null;
    });

    this.addressSub = combineLatest([
      this.nodeService.getAddressInfo(this.wallet.address),
      this.nodeService.getChxAddressAccounts(this.wallet.address),
      this.assetBridgeService.getAssets(),
      this.metamask.account$,
      this.metamask.chainName$,
    ]).subscribe(([balInfo, accounts, assets, account, chainName]) => {
      this.chxBalance = balInfo.balance.available;
      this.nonce = balInfo.nonce + 1;
      this.fee = this.nodeService.getMinFee();

      this.accounts = accounts.accounts;
      this.assets = [this.chxService.ChxAsset, ...assets.data];

      this.initAssetBridgeForm();

      if (this.metaMaskAddress !== account) {
        this.metaMaskAddress = account;
        this.assetBridgeForm.get('toAddress').setValue(this.metaMaskAddress);
        if (this.step !== 1 || this.error) {
          this.error = null;
          this.step = 2;
        }
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSub && this.paramsSub.unsubscribe();
    this.addressSub && this.addressSub.unsubscribe();
    this.bridgeFeeSub && this.bridgeFeeSub.unsubscribe();
    this.transferSub && this.transferSub.unsubscribe();
    this.selectedAssetSub && this.selectedAssetSub.unsubscribe();
    this.selectedAccSub && this.selectedAccSub.unsubscribe();
    this.toChainSub && this.selectedAccSub.unsubscribe();
    this.fromChainSub && this.fromChainSub.unsubscribe();
  }

  initAcceptBridgeForm(): void {
    this.acceptBridgeForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });
  }

  initAssetBridgeForm(): void {
    this.assetBridgeForm = this.fb.group({
      asset: [this.assetCodeFromParams ? this.assetCodeFromParams : this.assets[1].assetCode],
      amount: [this.balanceFromParams ? this.balanceFromParams : 0, [Validators.required, Validators.min(0.0000001)]],
      from: ['own'],
      to: [this.metamask.currentChainCode()],
      fromAddress: [this.chxAddress],
      toAddress: [this.metaMaskAddress],
      account: [this.accountHashFromParams ? this.accountHashFromParams : this.accounts[0]],
    });

    this.selectedAssetSub = this.assetBridgeForm.get('asset').valueChanges.subscribe((value) => {
      this.setAmount(0);
      if (value === 'CHX') {
        this.initChxBridge();
      } else {
        const supportsAssetBridge = this.assetBridgeChains
          .map((chain) => chain.code)
          .includes(this.metamask.currentChainCode());
        if (supportsAssetBridge) {
          this.initAssetBridge();
        } else {
          this.assetBridgeForm.get('asset').setValue('CHX', { emitEvent: false });
          this.error = `Currently selected asset ${value} isn't supported on ${this.targetChainName(
            this.metamask.currentChainCode()
          )} please change network in metamask to Ethereum and try again.`;
        }
      }
    });

    this.selectedAccSub = this.assetBridgeForm.get('account').valueChanges.subscribe(async (value) => {
      this.nativeBalance = await this.assetBridgeService.getNativeBalance(
        this.account,
        this.tokenHash(this.selectedAsset)
      );
    });

    this.toChainSub = this.assetBridgeForm.get('to').valueChanges.subscribe(async (value) => {
      if (value !== 'own') {
        if (this.selectedAsset === 'CHX') await this.initChxBridge();
        if (this.selectedAsset !== 'CHX') await this.initAssetBridge();
      }
    });

    this.fromChainSub = this.assetBridgeForm.get('from').valueChanges.subscribe(async (value) => {
      if (value !== 'own') {
        if (this.selectedAsset === 'CHX') await this.initChxBridge();
        if (this.selectedAsset !== 'CHX') await this.initAssetBridge();
      }
    });
  }

  setValidators() {
    if (this.selectedAsset === 'CHX') {
      this.assetBridgeForm
        .get('amount')
        .setValidators([
          Validators.required,
          Validators.min(this.minWrapAmount),
          Validators.max(
            this.from === 'own' ? (this.chxBalance > 0 ? +(this.chxBalance - this.fee).toFixed(7) : 0.1) : this.balance
          ),
        ]);
    }
    if (this.selectedAsset !== 'CHX') {
      this.assetBridgeForm
        .get('amount')
        .setValidators([
          Validators.required,
          Validators.min(0.000001),
          Validators.max(this.from === 'own' ? this.nativeBalance : this.balance),
        ]);
      if (this.to !== 'own') {
        this.assetBridgeForm.get('toAddress').setValidators([Validators.required, validateEthAddress]);
        this.assetBridgeForm.get('toAddress').updateValueAndValidity();
        this.assetBridgeForm.get('fromAddress').clearValidators();
        this.assetBridgeForm.get('fromAddress').updateValueAndValidity();
      }
      if (this.from !== 'own') {
        this.assetBridgeForm.get('fromAddress').clearValidators();
        this.assetBridgeForm.get('fromAddress').updateValueAndValidity();
        this.assetBridgeForm.get('toAddress').clearValidators();
        this.assetBridgeForm.get('toAddress').updateValueAndValidity();
      }
    }
    this.assetBridgeForm.markAsPristine();
    this.assetBridgeForm.updateValueAndValidity();
  }

  get selectedAsset(): string {
    return this.assetBridgeForm.get('asset').value;
  }

  get fromAddress(): string {
    return this.assetBridgeForm.get('fromAddress').value;
  }

  get toAddress(): string {
    return this.assetBridgeForm.get('toAddress').value;
  }

  get from(): string {
    return this.assetBridgeForm.get('from').value;
  }

  get to(): string {
    return this.assetBridgeForm.get('to').value;
  }

  get account(): string {
    return this.assetBridgeForm.get('account').value;
  }

  get amount(): number {
    return +this.assetBridgeForm.get('amount').value;
  }

  get transferIsDisabled(): boolean {
    if (this.loading) return true;
    if (this.assetBridgeForm.invalid) return true;
    if (this.selectedAsset === 'CHX' && !this.addressIsMapped) return true;
  }

  get max(): number {
    if (this.selectedAsset === 'CHX') {
      if (this.from === 'own') {
       const max = Number((this.chxBalance - this.fee).toFixed(7));
       return max > 0 ? max : 0;
      };
      return this.balance;
    }
    if (this.selectedAsset !== 'CHX') {
      if (this.from === 'own') {
        return this.nativeBalance;
      }
      return this.balance;
    }
  }

  setAmount(amount: number): void {
    this.assetBridgeForm.get('amount').setValue(amount);
  }

  setMaxAmount(): void {
    if (this.selectedAsset === 'CHX') {
      if (this.max >= this.minWrapAmount) {
        this.setAmount(this.max);
      } else {
        this.setAmount(this.max);
        this.assetBridgeForm.get('amount').setErrors({ min: true });
        this.assetBridgeForm.get('amount').markAsDirty();
        this.assetBridgeForm.get('amount').markAsTouched();
      }
    }
    if (this.selectedAsset !== 'CHX') {
      this.setAmount(this.max);
    }
  }

  targetChainCode(): string {
    return this.to !== 'own' ? this.to : this.from;
  }

  targetChainName(code: string): string {
    return this.blockchains?.find((chain) => chain.code === code).name;
  }

  tokenName(code: string): string {
    return this.blockchains?.find((chain) => chain.code === code).token;
  }

  tokenHash(code: string): string {
    return this.assets?.find((asset) => asset.assetCode === code).assetHash;
  }

  tokenAddress(code: string, blockchain: string): string | null {
    if (blockchain) {
      const chainCode = blockchain.charAt(0).toUpperCase() + blockchain.slice(1);
      return this.assets
        .find((asset) => asset.assetCode === code)
        .bridgedTokens.find((token) => token.targetBlockchain === chainCode)?.tokenAddress;
    }
    return null;
  }

  async swapBlockchains() {
    if (this.from === 'own') {
      this.assetBridgeForm.get('from').setValue(this.to);
      this.assetBridgeForm.get('to').setValue('own');
      this.assetBridgeForm.get('fromAddress').setValue(this.toAddress);
      this.assetBridgeForm.get('toAddress').setValue(this.chxAddress);
    } else {
      this.assetBridgeForm.get('to').setValue(this.from);
      this.assetBridgeForm.get('from').setValue('own');
      this.assetBridgeForm.get('toAddress').setValue(this.fromAddress);
      this.assetBridgeForm.get('fromAddress').setValue(this.chxAddress);
    }
    if (this.selectedAsset === 'CHX') {
      this.getBridgeFees();
    }

    if (this.selectedAsset !== 'CHX') {
      if (this.to === 'own') {
        this.assetBridgeFee = await this.assetBridgeService.getNativeTransferFee();
      } else {
        this.assetBridgeFee = await this.assetBridgeService.ethTransferFee();
      }
    }

    this.setValidators();
  }

  async connect() {
    try {
      await this.metamask.init();
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  }

  async initChxBridge() {
    try {
      if (this.metamask.currentChainCode() !== 'eth') {
        this.assetBridgeForm.get('asset').setValue('CHX', { emitEvent: false });
      }
      this.blockchains = this.chxBridgeChains;
      this.chxService.resetStatus();
      this.txStatus$ = this.chxService.status$;
      this.txResult$ = this.chxService.txResult$;
      this.chxService.initContracts(this.metamask.web3, this.targetChainCode());
      this.addressIsMapped = await this.chxService.addressIsMapped(this.chxAddress, this.targetChainCode());

      this.explorer = this.chxService.explorer;

      if (this.addressIsMapped) {
        this.wrongNetwork = await this.chxService.addressIsMappedToOtherChxAddress(
          this.metaMaskAddress,
          this.chxAddress
        );
        if (this.wrongNetwork) {
          this.error = `Currently selected ${this.targetChainCode()} Address has been already mapped to other CHX Address, please select other account in your MetaMask and try again.`;
        }
      }

      if (this.metaMaskAddress) {
        const { balance, minWrapAmount } = await this.chxService.balanceAndMinAmount(this.metaMaskAddress);
        this.balance = balance;
        this.minWrapAmount = minWrapAmount;
        this.getBridgeFees();
      }
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  }

  getBridgeFees() {
    this.bridgeFeeSub = this.chxService.getBridgeFee(this.toAddress, this.from, this.to).subscribe((fee) => {
      this.bridgeFee = fee;
      this.setValidators();
    });
  }

  async initAssetBridge() {
    try {
      this.blockchains = this.assetBridgeChains;
      this.assetBridgeService.resetStatus();
      this.txStatus$ = this.assetBridgeService.status$;
      this.txResult$ = this.assetBridgeService.txResult$;

      await this.assetBridgeService.initContracts(
        this.metamask.web3,
        this.targetChainCode(),
        this.tokenAddress(this.selectedAsset, this.targetChainCode())
      );

      this.explorer = this.assetBridgeService.explorer;

      if (this.to === 'own') {
        this.assetBridgeFee = await this.assetBridgeService.getNativeTransferFee();
      } else {
        this.assetBridgeFee = await this.assetBridgeService.ethTransferFee();
      }

      this.nativeBalance = await this.assetBridgeService.getNativeBalance(
        this.account,
        this.tokenHash(this.selectedAsset)
      );
      this.balance = await this.assetBridgeService.balanceOf(this.metaMaskAddress);
      this.setValidators();
    } catch (error) {
      console.log(error);
      this.error = error.message;
    }
  }

  async acceptRisks() {
    try {
      this.risksAccepted = true;
      this.step = 2;
      if (this.metamask.currentChainCode() === 'eth') {
        await this.initAssetBridge();
      } else {
        await this.initChxBridge();
      }
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  }

  async mapAddress() {
    try {
      this.mappingAddresses = true;
      await this.chxService.mapAddress(
        this.metaMaskAddress,
        this.chxAddress,
        this.privateKeyService.getWalletInfo().privateKey
      );
      this.showMapping = false;
      this.addressJustMapped = true;
      this.addressIsMapped = true;
    } catch (error) {
      this.showMapping = false;
      this.mappingAddresses = false;
      console.log(error);
      this.error = error.message;
    }
  }

  async transfer() {
    if (this.selectedAsset === 'CHX') {
      await this.transferChx();
    }
    if (this.selectedAsset !== 'CHX') {
      await this.transferAsset();
    }
  }

  async transferChx() {
    try {
      if (this.from === 'own') {
        await this.chxService.transferChxFromWeOwn(
          this.chxAddress,
          this.nonce,
          this.fee,
          this.amount,
          this.wallet.privateKey
        );
      }

      if (this.from !== 'own') {
        const amountToTransfer = this.amount * Math.pow(10, 7);
        await this.chxService.transferToWeOwn(amountToTransfer, this.metaMaskAddress);
      }
    } catch (error) {
      console.log(error);
      this.error = error.message;
    }
  }

  async transferAsset() {
    try {
      if (this.from === 'own') {
        await this.assetBridgeService.transferFromNativeChain(
          this.tokenHash(this.selectedAsset),
          this.toAddress,
          this.account,
          this.chxAddress,
          this.amount
        );
      }

      if (this.from !== 'own') {
        await this.assetBridgeService.transferToNativeChain(
          this.metaMaskAddress,
          this.tokenAddress(this.selectedAsset, this.targetChainCode()),
          this.account,
          this.amount
        );
      }
    } catch (error) {
      console.log(error);
      this.error = error.message;
    }
  }

  close() {
    this.reset();
    if (!this.mappingAddresses) {
      this.router.navigate(['/wallet']);
    }
    this.mappingAddresses = false;
  }

  reset() {
    this.addressJustMapped = false;
    if (this.wrongNetwork) {
      this.step = 1;
      this.risksAccepted = false;
    }

    if (this.step !== 1) {
      this.step = 2;
    }

    this.chxService.resetStatus();
    this.assetBridgeService.resetStatus();
    this.error = null;
    this.wrongNetwork = false;
  }

  tokenImageError(event: any): void {
    event.srcElement.setAttribute(
      'src',
      `data:image/svg+xml; utf8, <svg viewBox="238.393 170.135 20.44 20.44" xmlns="http://www.w3.org/2000/svg"><circle style="stroke: rgb(132,132,132); fill: none; stroke-width: 2px;" cx="248.613" cy="180.355" r="8.246"/>
      <circle style="stroke: rgb(132,132,132); fill: none;" cx="248.613" cy="180.355" r="5.032"/></svg>`
    );
  }
}
