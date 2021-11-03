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

      this.initAcceptBridgeForm();
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
      asset: [this.assetCodeFromParams ? this.assetCodeFromParams : 'CHX'],
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
        if (this.to !== 'own') this.assetBridgeForm.get('to').setValue('eth');
        if (this.from !== 'own') this.assetBridgeForm.get('from').setValue('eth');
        this.initAssetBridge();
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
      if (this.from === 'own') return Number((this.chxBalance - this.fee).toFixed(7));
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
      }
      return;
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
        .bridgedTokens.find((token) => token.targetBlockchain === chainCode).tokenAddress;
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

      console.log(this.assetBridgeFee);

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
      if (this.assetCodeFromParams) {
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
      'data:image/png;base64,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'
    );
  }
}
