import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NodeService } from 'src/app/services/node.service';
import { PrivatekeyService } from 'src/app/services/privatekey.service';

import { WalletInfo } from './../../models/wallet-info.model';
import { TxResult } from 'src/app/models/submit-transactions.model';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OwnAnimations } from '../../shared';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-validator-managment',
  templateUrl: './validator-managment.component.html',
  styleUrls: ['./validator-managment.component.css'],
  animations: [OwnAnimations.contentInOut]
})
export class ValidatorManagmentComponent implements OnDestroy {

  configForm: FormGroup;
  submissionErrors: string[];

  txResult: TxResult;
  wallet: WalletInfo;

  isKeyImported = false;
  isSubmited = false;

  addressSub: Subscription;
  txSub: Subscription;

  nonce: number;
  fee: number;
  tab = 'config';

  constructor(
    private formBuilder: FormBuilder,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService
  ) {

    this.isKeyImported = privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }

    this.wallet = this.privateKeyService.getWalletInfo();

    this.addressSub = this.nodeService.getAddressInfo(this.wallet.address)
      .subscribe(balInfo => {
        this.nonce = balInfo.nonce + 1;
        this.fee = this.nodeService.getMinFee();
        this.setupForm();
      });
   }

  setupForm() {
    this.configForm = this.formBuilder.group({
      networkAddress: ['', Validators.required],
      sharedRewardPercent: [0, Validators.required],
      isEnabled: [false, Validators.required]
    });
  }

  submit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      const txToSign = ownBlockchainSdk.transactions.createTx(
        this.wallet.address,
        this.nonce,
        this.fee
      );

    txToSign.addConfigureValidatorAction(
      value.networkAddress,
      value.sharedRewardPercent,
      value.isEnabled
    );

    const signature = txToSign.sign(environment.networkCode, this.wallet.privateKey);

    this.txSub = this.nodeService.submitTransaction(signature).subscribe(
      result => {
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
    this.isSubmited = false;
    this.submissionErrors = null;
    this.setupForm();
  }

  ngOnDestroy() {
    if (this.addressSub) { this.addressSub.unsubscribe(); }
    if (this.txSub) { this.txSub.unsubscribe(); }
  }

}
