import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NodeService } from 'src/app/services/node.service';
import { PrivatekeyService } from 'src/app/services/privatekey.service';
import { CryptoService } from 'src/app/services/crypto.service';

import { WalletInfo } from './../../models/wallet-info.model';
import { Tx, TxAction, TxResult, ConfigureValidator } from 'src/app/models/submit-transactions.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-validator-managment',
  templateUrl: './validator-managment.component.html',
  styleUrls: ['./validator-managment.component.css']
})
export class ValidatorManagmentComponent implements OnDestroy {

  configForm: FormGroup;
  submissionErrors: string[];

  tx: any;
  txAction: TxAction;
  txResult: TxResult;
  wallet: WalletInfo;

  displayActions = false;
  isKeyImported = false;
  isSubmited = false;

  addressSub: Subscription;
  txSub: Subscription;

  tab = 'config';

  constructor(
    private formBuilder: FormBuilder,
    private nodeService: NodeService,
    private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService
  ) {

    this.isKeyImported = privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }

    this.wallet = this.privateKeyService.getWalletInfo();

    this.addressSub = this.nodeService.getAddressInfo(this.privateKeyService.getWalletInfo().address)
      .subscribe(balInfo => {

          this.tx = ownBlockchainSdk.transactions.createTx(
            this.wallet.address,
            balInfo.nonce + 1,
            this.nodeService.getMinFee()
          );

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

      this.tx.addConfigureValidatorAction(
        value.networkAddress,
        value.sharedRewardPercent,
        value.isEnabled
      );

      this.txSub = this.cryptoService.signTransaction(
        this.wallet.privateKey, this.tx
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
