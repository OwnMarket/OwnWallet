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
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css'],
})
export class AddAssetComponent implements OnInit {
  @Output() onClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdded: EventEmitter<string> = new EventEmitter<string>();
  @Input() account: string;

  assetForm: FormGroup;
  submissionErrors: string[];
  txResult: TxResult;
  wallet: WalletInfo;

  isKeyImported = false;
  isSubmited = false;
  assetHash: string;

  txSub: Subscription;

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
    this.initAssetForm();
  }

  initAssetForm(): void {
    this.assetForm = this.fb.group({
      assetCode: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1), Validators.max(99999999999)]],
    });
  }

  submit(form: FormGroup): void {
    const {
      valid,
      value: { assetCode, amount },
    } = form;

    if (valid) {
      this.txSub = this.nodeService
        .getAddressInfo(this.wallet.address)
        .pipe(
          mergeMap((balInfo) => {
            const nonce = balInfo.nonce + 1;
            const fee = this.nodeService.getMinFee();
            const txToSign = ownBlockchainSdk.transactions.createTx(this.wallet.address, nonce, fee);
            this.assetHash = txToSign.addCreateAssetAction();
            txToSign.addSetAssetCodeAction(this.assetHash, assetCode);
            txToSign.addCreateAssetEmissionAction(this.account, this.assetHash, amount);
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
  }

  close(): void {
    if (this.assetHash) {
      this.onAdded.emit(this.assetHash);
    } else {
      this.onClosed.emit();
    }
  }
}
