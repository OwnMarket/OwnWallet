import { Component, OnDestroy, OnInit } from '@angular/core';
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
  chainName$: Observable<string>;

  isKeyImported: boolean;
  txResult: TxResult;
  wallet: WalletInfo;
  chxAddress: string;
  chxBalance: number;
  nonce: number;
  fee: number;

  addressSub: Subscription;
  bridgeFeeSub: Subscription;

  step: number = 2;
  risksAccepted: boolean = false;
  loading: boolean = false;
  showFee: boolean = false;
  bridgeFee: BridgeFee;

  assetHashFromParams: string;
  balanceFromParams: number;
  addressIsMapped: boolean;

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
    private chxService: ChxBridgeService
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
      this.activatedRoute.queryParams,
    ]).subscribe(([balInfo, accounts, assets, params]) => {
      this.chxBalance = balInfo.balance.available;
      this.nonce = balInfo.nonce + 1;
      this.fee = this.nodeService.getMinFee();

      const { assetHash, balance } = params;
      this.assetHashFromParams = assetHash || null;
      this.balanceFromParams = +balance || null;
      this.accounts = accounts.accounts;
      this.assets = [this.chxService.ChxAsset, ...assets.data];

      this.metaMaskStatus$ = this.metamask.status$;
      this.chainName$ = this.metamask.chainName$;

      this.initAcceptBridgeForm();
      this.initAssetBridgeForm();
      this.initChxBridge();
    });
  }

  ngOnDestroy(): void {
    this.addressSub && this.addressSub.unsubscribe();
    this.bridgeFeeSub && this.bridgeFeeSub.unsubscribe();
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

  async initChxBridge() {
    try {
      this.chxService.initContracts(this.metamask.web3, this.to);
      this.addressIsMapped = await this.chxService.addressIsMapped(this.chxAddress, this.to);
    } catch (error) {
      console.log(error.message);
    }
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

  get metaMaskAddress(): string {
    return this.metamask.currentAccount;
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

  acceptRisks() {
    this.risksAccepted = true;
    this.step = 2;
  }
}
