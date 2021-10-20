import { ChangeDetectorRef, Component, OnDestroy, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';

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

  isKeyImported: boolean;
  txResult: TxResult;
  wallet: WalletInfo;
  chxAddress: string;
  chxBalance: number;
  balance: number;
  minWrapAmount: number;
  nonce: number;
  fee: number;

  addressSub: Subscription;
  bridgeFeeSub: Subscription;
  transferSub: Subscription;

  step: number = 1;
  risksAccepted: boolean = false;
  loading: boolean = false;
  showFee: boolean = false;
  bridgeFee: BridgeFee;

  assetHashFromParams: string;
  balanceFromParams: number;
  addressIsMapped: boolean;
  wrongNetwork: boolean;
  error: string;
  metaMaskAddress: string;

  chainName: string;
  accounts: string[] = [];
  assets: BridgeAsset[] = [];
  blockchains = [
    { name: 'Ethereum', code: 'eth' },
    { name: 'Binance Smart Chain', code: 'bsc' },
  ];

  constructor(
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

    this.addressSub = combineLatest([
      this.nodeService.getAddressInfo(this.wallet.address),
      this.nodeService.getChxAddressAccounts(this.wallet.address),
      this.assetBridgeService.getAssets(),
      this.metamask.account$,
      this.metamask.chainName$,
      this.activatedRoute.queryParams,
    ]).subscribe(([balInfo, accounts, assets, account, chainName, params]) => {
      this.chxBalance = balInfo.balance.available;
      this.nonce = balInfo.nonce + 1;
      this.fee = this.nodeService.getMinFee();

      const { assetHash, balance } = params;
      this.assetHashFromParams = assetHash || null;
      this.balanceFromParams = +balance || null;
      this.accounts = accounts.accounts;
      this.assets = [this.chxService.ChxAsset, ...assets.data];

      this.metaMaskStatus$ = this.metamask.status$;

      this.initAcceptBridgeForm();
      this.initAssetBridgeForm();

      if (this.chainName !== chainName) {
        this.reset();
        console.log(chainName);
        this.chainName = chainName;
        this.changeDetectorRef.markForCheck();
      }

      if (this.metaMaskAddress !== account) {
        this.reset();
        this.metaMaskAddress = account;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.addressSub && this.addressSub.unsubscribe();
    this.bridgeFeeSub && this.bridgeFeeSub.unsubscribe();
    this.transferSub && this.transferSub.unsubscribe();
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
      asset: ['CHX'],
      amount: [0, [Validators.required, Validators.min(0.0000001)]],
      from: ['own'],
      to: ['eth'],
      fromAddress: [this.chxAddress],
      toAddress: [this.metaMaskAddress],
      account: [this.accounts[0]],
    });
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

  targetChainName(code: string): string {
    return this.blockchains.find((chain) => chain.code === code).name;
  }

  swapBlockchains() {
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
  }

  async connect() {
    try {
      await this.metamask.init();
      this.assetBridgeForm.get('toAddress').setValue(this.metaMaskAddress);
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  }

  async initChxBridge() {
    try {
      this.chxService.initContracts(this.metamask.web3, this.to);
      this.addressIsMapped = await this.chxService.addressIsMapped(this.chxAddress, this.to);
      this.wrongNetwork = await this.chxService.addressIsMappedToOtherChxAddress(this.metaMaskAddress, this.chxAddress);
      if (this.addressIsMapped && this.metaMaskAddress) {
        const { balance, minWrapAmount } = await this.chxService.balanceAndMinAmount(this.metaMaskAddress);
        this.balance = balance;
        this.minWrapAmount = minWrapAmount;
        this.bridgeFeeSub = this.chxService
          .getBridgeFee(this.toAddress, this.from, this.to)
          .subscribe((fee) => (this.bridgeFee = fee));
      }
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  }

  async acceptRisks() {
    try {
      this.risksAccepted = true;
      this.step = 2;
      await this.initChxBridge();
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  }

  async mapAddress() {
    try {
      this.transferSub = this.chxService
        .mapAddress(this.metaMaskAddress, this.chxAddress, this.privateKeyService.getWalletInfo().privateKey)
        .subscribe((resp) => {
          console.log(resp);
          this.addressIsMapped = true;
        });
    } catch (error) {
      console.log(error);
    }
  }

  reset() {
    this.error = null;
    this.risksAccepted = false;
    this.wrongNetwork = false;
    this.txResult = null;
    this.step = 1;
  }
}
