import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NodeService } from 'src/app/services/node.service';
import { PrivatekeyService } from 'src/app/services/privatekey.service';
import { CryptoService } from 'src/app/services/crypto.service';

import { Tx } from 'src/app/models/submit-transactions.model';
import { TxAction, ChxTransfer, TxResult } from './../../../models/submit-transactions.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-send-chx',
  templateUrl: './send-chx.component.html',
  styleUrls: ['./send-chx.component.css']
})
export class SendChxComponent implements OnDestroy {

  sendChxForm: FormGroup;
  submissionErrors: string[];

  tx: Tx;
  txAction: TxAction;
  txResult: TxResult;

  displayActions = false;
  isKeyImported = false;
  isSubmited = false;

  addressSub: Subscription;
  txSub: Subscription;

  step = 1;

  constructor(
    private formBuilder: FormBuilder,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService
  ) {

    this.isKeyImported = privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }

    this.addressSub = this.nodeService.getAddressInfo(this.privateKeyService.getWalletInfo().address)
      .subscribe(balInfo => {
          this.tx = new Tx();
          this.tx.senderAddress = this.privateKeyService.getWalletInfo().address;
          this.tx.nonce = balInfo.nonce + 1;
          this.tx.actionFee = this.nodeService.getMinFee();
          this.setupForm();
      });
   }

  setupForm() {
    this.sendChxForm = this.formBuilder.group({
      amount: [0, [Validators.required, Validators.min(0.1)]],
      recipientAddress: ['', Validators.required],
      nonce: [this.tx.nonce, Validators.required],
      actionFee: [this.tx.actionFee, Validators.required]
    });
  }

  submit({ value, valid }: { value: any, valid: boolean }) {

    if (valid) {
      const txToSign = new Tx();
      txToSign.senderAddress = this.privateKeyService.getWalletInfo().address;
      txToSign.nonce = value.nonce;
      txToSign.actionFee = value.actionFee;

      this.txAction = new TxAction();
      this.txAction.actionType = 'TransferChx';

      this.txAction.actionData = new ChxTransfer(
        value.recipientAddress,
        value.amount
      );

      txToSign.actions = [
        this.txAction
      ];

      this.txSub = this.cryptoService.signTransaction(
        this.privateKeyService.getWalletInfo().privateKey, txToSign
        )
          .pipe(
            switchMap(env => this.nodeService.submitTransaction(env))
          ).subscribe(result => {
            this.isSubmited = true;
            if (result.errors) {
              this.submissionErrors = result.errors;
              return;
            }
            this.txResult = (result as TxResult);
          });
    }
  }

  reset() {
    this.step = 1;
    this.isSubmited = false;
    this.submissionErrors = null;
    this.displayActions = false;
    this.setupForm();
  }

  ngOnDestroy() {
    if (this.addressSub) { this.addressSub.unsubscribe(); }
    if (this.txSub) { this.txSub.unsubscribe(); }
  }

}
