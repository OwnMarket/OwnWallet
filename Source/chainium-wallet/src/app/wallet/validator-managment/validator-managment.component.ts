import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';

import { WalletInfo } from '../../shared/models/wallet-info.model';
import { TxResult } from 'src/app/shared/models/submit-transactions.model';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OwnAnimations } from '../../shared';
import { ValidatorInfo, ValidatorsInfo } from 'src/app/shared/models/validators-info.model';
import { map, mergeMap } from 'rxjs/operators';

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
  validator: ValidatorInfo;

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
    .pipe(
      map(balInfo => {
        this.nonce = balInfo.nonce + 1;
        this.fee = this.nodeService.getMinFee();
        return balInfo;
      }),
      mergeMap(
         info => this.nodeService.getValidatorInfo(this.wallet.address)
         .pipe(
           map(
             (item: any) => item
         ))))
    .subscribe(
      (response: any) => {
      if (response && !response.errors) {
        this.validator = response;
        this.setupForm();
        this.configForm.patchValue(this.validator);
      } else {
        this.setupForm();
      }
    });

   }

  setupForm() {
    this.configForm = this.formBuilder.group({
      networkAddress: ['', Validators.required],
      sharedRewardPercent: [0, Validators.required],
      isEnabled: [false, Validators.required]
    });
  }

  configureValidator({ value, valid }: { value: any, valid: boolean }) {
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
    this.submit(signature);

    }
  }

  removeValidator() {

    const txToSign = ownBlockchainSdk.transactions.createTx(
      this.wallet.address,
      this.nonce,
      this.fee
    );

    txToSign.addRemoveValidatorAction();

    const signature = txToSign.sign(environment.networkCode, this.wallet.privateKey);
    this.submit(signature);

  }

  submit(signature: any) {
    this.txSub = this.nodeService.submitTransaction(signature).subscribe(
      result => {
        this.isSubmited = true;
        if (result.errors) {
          this.submissionErrors = result.errors;
          return;
        }
        this.txResult = (result as TxResult);
        setTimeout(() => this.reset(), 5000);
    });
  }

  reset() {
    this.isSubmited = false;
    this.submissionErrors = null;
    this.setupForm();
  }

  selectTab(tab: string) {
    this.tab = tab;
    this.reset();
  }

  ngOnDestroy() {
    if (this.addressSub) { this.addressSub.unsubscribe(); }
    if (this.txSub) { this.txSub.unsubscribe(); }
  }

}
