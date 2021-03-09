import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';

import { TxResult } from '../../../shared/models/submit-transactions.model';
import { Subscription } from 'rxjs';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { environment } from 'src/environments/environment';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-send-chx',
  templateUrl: './send-chx.component.html',
  styleUrls: ['./send-chx.component.css'],
})
export class SendChxComponent implements OnInit, OnDestroy {
  sendChxForm: FormGroup;
  submissionErrors: string[];

  txResult: TxResult;
  wallet: WalletInfo;

  displayActions = false;
  isKeyImported = false;
  isSubmited = false;

  addressSub: Subscription;
  txSub: Subscription;

  balance: number;
  nonce: number;
  fee: number;

  step = 1;

  constructor(
    private formBuilder: FormBuilder,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService
  ) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
    this.fetchAddressInfo();
  }

  fetchAddressInfo() {
    this.addressSub = this.nodeService.getAddressInfo(this.wallet.address).subscribe((balInfo) => {
      this.balance = balInfo.balance.total;
      this.nonce = balInfo.nonce + 1;
      console.log(this.nonce);
      this.fee = this.nodeService.getMinFee();
      this.setupForm();
    });
  }

  setupForm() {
    this.sendChxForm = this.formBuilder.group({
      amount: [0, [Validators.required, Validators.min(0.1), Validators.max(this.balance)]],
      recipientAddress: ['', Validators.required],
      nonce: [this.nonce, Validators.required],
      actionFee: [this.fee, Validators.required],
    });
  }

  get total(): number {
    return Number((this.sendChxForm.get('amount').value - this.sendChxForm.get('actionFee').value).toFixed(7));
  }

  submit({ value, valid }: { value: any; valid: boolean }) {
    if (valid) {
      const txToSign = ownBlockchainSdk.transactions.createTx(this.wallet.address, value.nonce, value.actionFee);

      txToSign.addTransferChxAction(value.recipientAddress, value.amount);

      const signature = txToSign.sign(environment.networkCode, this.wallet.privateKey);

      this.txSub = this.nodeService.submitTransaction(signature).subscribe((result) => {
        this.isSubmited = true;
        if (result.errors) {
          this.submissionErrors = result.errors;
          return;
        }
        this.txResult = result as TxResult;
      });
    }
  }

  reset() {
    this.step = 1;
    this.isSubmited = false;
    this.submissionErrors = null;
    this.displayActions = false;
    this.fetchAddressInfo();
  }

  ngOnDestroy() {
    if (this.addressSub) this.addressSub.unsubscribe();
    if (this.txSub) this.txSub.unsubscribe();
  }
}
