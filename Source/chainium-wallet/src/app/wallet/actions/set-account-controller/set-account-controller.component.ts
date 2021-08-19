import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TxResult } from 'src/app/shared/models/submit-transactions.model';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';
import { environment } from 'src/environments/environment';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-set-account-controller',
  templateUrl: './set-account-controller.component.html',
  styleUrls: ['./set-account-controller.component.css'],
})
export class SetAccountControllerComponent implements OnInit, OnDestroy {
  @Output() onClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdded: EventEmitter<any> = new EventEmitter<any>();
  @Input() account: string;

  controllerForm: FormGroup;
  submissionErrors: string[];
  txResult: TxResult;
  wallet: WalletInfo;

  isKeyImported = false;
  isSubmited = false;
  addr: string;

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
    this.addr = this.wallet.address;
    this.initControllerForm();
  }

  initControllerForm(): void {
    this.controllerForm = this.fb.group({
      controllerAddress: ['', Validators.required],
    });
  }

  submit(form: FormGroup): void {
    const {
      valid,
      value: { controllerAddress },
    } = form;

    if (valid) {
      this.txSub = this.nodeService
        .getAddressInfo(this.wallet.address)
        .pipe(
          mergeMap((balInfo) => {
            const nonce = balInfo.nonce + 1;
            const fee = this.nodeService.getMinFee();
            const txToSign = ownBlockchainSdk.transactions.createTx(this.wallet.address, nonce, fee);
            txToSign.addSetAccountControllerAction(this.account, controllerAddress);
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
    if (this.isSubmited && !this.submissionErrors) {
      this.onAdded.emit();
    } else {
      this.onClosed.emit();
    }
  }
}
