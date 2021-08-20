import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TxResult } from 'src/app/shared/models/submit-transactions.model';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';
import { environment } from 'src/environments/environment';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-transfer-asset',
  templateUrl: './transfer-asset.component.html',
  styleUrls: ['./transfer-asset.component.css'],
})
export class TransferAssetComponent implements OnInit {
  @Output() onClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdded: EventEmitter<string> = new EventEmitter<string>();
  @Input() account: string;
  @Input() assetBalance: number;
  @Input() set asset(value: string) {
    this.assetHash = value;
    this.fetchAssetInfo(this.assetHash);
  }

  transferAssetForm: FormGroup;
  submissionErrors: string[];
  txResult: TxResult;
  wallet: WalletInfo;

  isKeyImported = false;
  isSubmited = false;

  assetCode: string;
  assetHash: string;

  txSub: Subscription;
  assetInfoSub: Subscription;

  constructor(
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }
    this.wallet = this.privateKeyService.getWalletInfo();
  }

  initTransferAssetForm(): void {
    this.transferAssetForm = this.fb.group({
      amount: [this.assetBalance, [Validators.required, Validators.max(this.assetBalance)]],
      toAccountHash: [null, [Validators.required]],
    });
  }

  fetchAssetInfo(assetHash: string): void {
    this.assetInfoSub = this.nodeService.getAssetInfo(assetHash).subscribe((resp) => {
      this.initTransferAssetForm();
      this.assetCode = resp.assetCode;
    });
  }

  submit(form: FormGroup): void {
    const {
      valid,
      value: { amount, toAccountHash },
    } = form;

    if (valid) {
      this.txSub = this.nodeService
        .getAddressInfo(this.wallet.address)
        .pipe(
          mergeMap((balInfo) => {
            const nonce = balInfo.nonce + 1;
            const fee = this.nodeService.getMinFee();
            const txToSign = ownBlockchainSdk.transactions.createTx(this.wallet.address, nonce, fee);
            txToSign.addTransferAssetAction(this.account, toAccountHash, this.assetHash, amount);
            const signature = txToSign.sign(environment.networkCode, this.wallet.privateKey);
            return this.nodeService.submitTransaction(signature);
          })
        )
        .subscribe((result) => {
          this.isSubmited = true;
          if (result.errors) {
            this.submissionErrors = result.errors;
            return;
          }
          this.txResult = result as TxResult;
        });
    }
  }

  ngOnDestroy(): void {
    if (this.txSub) this.txSub.unsubscribe();
    if (this.assetInfoSub) this.assetInfoSub.unsubscribe();
  }

  close(): void {
    if (this.isSubmited) {
      this.onAdded.emit(this.assetHash);
    } else {
      this.onClosed.emit();
    }
  }
}
