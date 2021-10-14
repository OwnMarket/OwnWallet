import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import {
  MetaMaskStatus,
  TxResult,
  WalletInfo,
  MetamaskService,
  NodeService,
  PrivatekeyService,
  CryptoService,
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

  step: number = 2;
  risksAccepted: boolean = false;
  loading: boolean = false;

  assets: any = ['chx', 'defx'];

  constructor(
    private fb: FormBuilder,
    private metamask: MetamaskService,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }
    this.wallet = this.privateKeyService.getWalletInfo();
    this.chxAddress = this.wallet.address;

    this.addressSub = this.nodeService.getAddressInfo(this.wallet.address).subscribe((balInfo) => {
      this.chxBalance = balInfo.balance.available;
      this.nonce = balInfo.nonce + 1;
      this.fee = this.nodeService.getMinFee();
      this.metaMaskStatus$ = this.metamask.status$;
      this.chainName$ = this.metamask.chainName$;
      this.initAcceptBridgeForm();
      this.initAssetBridgeForm();
    });
  }

  ngOnDestroy(): void {
    this.addressSub && this.addressSub.unsubscribe();
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
      asset: ['chx'],
      amount: [0, [Validators.required, Validators.min(0.0000001)]],
      fromBlockchain: ['own'],
      toBlockchain: ['eth'],
      address: [null],
      account: [null],
    });
  }

  get selectedAsset(): string {
    return this.assetBridgeForm.get('asset').value;
  }

  get from(): string {
    return this.assetBridgeForm.get('from').value;
  }

  get to(): string {
    return this.assetBridgeForm.get('to').value;
  }

  acceptRisks() {
    this.risksAccepted = true;
    this.step = 2;
  }
}
