import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { PrivatekeyService } from './../../services/privatekey.service';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';
import { NodeService } from './../../services/node.service';

import { WalletInfo } from 'src/app/models/wallet-info.model';
import { OwnAnimations } from '../../shared';
import { environment } from 'src/environments/environment';
import { TxResult } from 'src/app/models/submit-transactions.model';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
  animations: [OwnAnimations.contentInOut]
})
export class StakingComponent implements OnInit, OnDestroy {

  ColumnMode = ColumnMode;

  wallet: WalletInfo;
  isKeyImported = false;
  isLoading = false;

  actionForm: FormGroup;
  action: string;
  validator: string;

  myStakes: Observable<any>;
  validators: Observable<any>;
  delegated: Observable<any>;
  addressSub: Subscription;
  txSub: Subscription;

  nonce: number;
  fee: number;

  txResult: TxResult;

  isSubmited = false;
  submissionErrors: any;

  tab = 'mystakes';

  constructor(
    private formBuilder: FormBuilder,
    private privateKeyService: PrivatekeyService,
    private nodeService: NodeService,
    private ownModalService: OwnModalService
  ) {

    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }
    this.wallet = this.privateKeyService.getWalletInfo();

    this.addressSub = this.nodeService.getAddressInfo(this.wallet.address)
    .subscribe(balInfo => {
      this.nonce = balInfo.nonce + 1;
      this.fee = this.nodeService.getMinFee();

      this.actionForm = this.formBuilder.group({
        'amount': ['', Validators.required]
      });

    });

    this.fetchData();

  }

  ngOnInit() {
    this.isLoading = true;
  }

  fetchData() {
    this.myStakes = this.nodeService.getChxAddressStakes(this.wallet.address)
    .pipe(map(response => response.stakes));

    this.validators = this.nodeService.getValidators(false)
    .pipe(map(response => response.validators));

    this.delegated = this.myStakes.pipe(
      mergeMap(stakes => this.validators.pipe(
        map(items => {
          this.isLoading = false;
          if (stakes.length > 0) {
            return items.map((item: any, i: number) => Object.assign({}, item, stakes[i]));
          } else {
            return items;
          }
        }
    ))));
  }

  get amount() {
    return this.actionForm.get('amount').value;
  }

  set amount(value: number) {
    this.actionForm.get('amount').patchValue(value);
  }

  showActionForm(row, action) {
    this.ownModalService.open('form-modal');
    this.action = action;
    this.validator = row.validatorAddress;
    if (action === 'revoke') {
      this.amount = row.amount;
    } else {
      this.amount = 0;
    }
  }

  completeTx() {

    const txToSign = ownBlockchainSdk.transactions.createTx(
      this.wallet.address,
      this.nonce,
      this.fee
    );

    let value = this.amount;

    if (this.action === 'revoke') {
      value = -Math.abs(this.amount);
    }

    txToSign.addDelegateStakeAction(
        this.validator,
        value
    );

    const signature = txToSign.sign(
      environment.networkCode,
      this.wallet.privateKey
    );

    this.txSub = this.nodeService.submitTransaction(signature)
    .subscribe(
      result => {
        if (!result.errors) {
          this.isSubmited = true;
          this.txResult = (result as TxResult);
          this.ownModalService.close('form-modal');
          this.ownModalService.open('success-modal');
        } else  {
          this.submissionErrors = result.errors;
          this.ownModalService.open('error-modal');
          return;
        }
      });
  }

  toggleExpandRow(table, row) {
    table.rowDetail.toggleExpandRow(row);
  }

  closeModal(id: string) {
    this.ownModalService.close(id);
  }

  ngOnDestroy() {
    if (this.addressSub) { this.addressSub.unsubscribe(); }
    if (this.txSub) { this.txSub.unsubscribe(); }
  }

}
