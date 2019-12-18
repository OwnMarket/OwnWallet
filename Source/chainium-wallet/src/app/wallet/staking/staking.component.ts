import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { PrivatekeyService } from './../../services/privatekey.service';
import { NodeService } from './../../services/node.service';

import { WalletInfo } from 'src/app/models/wallet-info.model';
import { MyStakeInfo, MyStakes } from 'src/app/models/stakes-info.model';
import { ValidatorInfo } from './../../models/validators-info.model';
import { OwnAnimations } from '../../shared';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
  animations: [OwnAnimations.contentInOut]
})
export class StakingComponent implements OnInit {

  @ViewChild('validatorStatus') validatorStatus: TemplateRef<any>;
  @ViewChild('validatorActions') validatorActions: TemplateRef<any>;

  ColumnMode = ColumnMode;
  myStakesColumns: any[];
  validatorsColumns: any[];

  wallet: WalletInfo;
  isKeyImported = false;
  isLoading = false;

  myStakes: Observable<any>;
  validators: Observable<any>;
  delegated: Observable<any>;

  tab = 'mystakes';

  constructor(
    private privateKeyService: PrivatekeyService,
    private nodeService: NodeService
  ) {

    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }
    this.wallet = this.privateKeyService.getWalletInfo();

  }

  ngOnInit() {
    this.isLoading = true;
    this.setupValidatorColumns();
  
    this.myStakes = this.nodeService.getChxAddressStakes(this.wallet.address);
    this.validators = this.nodeService.getValidators(false);

    this.delegated = this.myStakes.pipe(
      map(response => response.stakes),
      mergeMap(stakes => this.validators.pipe(
        map(response => response.validators),
        map(validators => {
          
          this.isLoading = false;

          if (stakes.length > 0) {
            const newValidators = [];

            for (let validator of validators) {
              for (let stake of stakes) {
                if (stake.validatorAddress === validator.validatorAddress) {
                  newValidators.push({ ...validator, amount: stake.amount });
                } else {
                  newValidators.push(validator);
                }
              }
            }
            return newValidators;
          } else {
            return validators;
          }
      }
    ))));
  }


  delegate(row, value) {

    console.log(row, value);

  }

  revoke(row, value) {
    console.log(row, value);
  }

  setupValidatorColumns() {

    this.myStakesColumns = [
      {
        name: 'Validator address',
        prop: 'validatorAddress',
        flexGrow: 4
      },
      {
        name: 'Amount',
        prop: 'amount',
        flexGrow: 1
      },
      {
        name: '',
        prop: 'amount',
        flexGrow: 2,
        cellTemplate: this.validatorActions,
      }
    ];

    this.validatorsColumns = [
      {
        name: 'Validator address',
        prop: 'validatorAddress',
        flexGrow: 3
      },
      {
        name: 'Network Address',
        prop: 'networkAddress',
        flexGrow: 2
      },
      {
        name: 'Reward %',
        prop: 'sharedRewardPercent',
        flexGrow: 1
      },
      {
        name: 'Amount',
        prop: 'amount',
        flexGrow: 1
      },
      {
        name: 'Status',
        prop: 'isActive',
        flexGrow: 1,
        cellTemplate: this.validatorStatus
      },
      {
        name: '',
        prop: 'amount',
        flexGrow: 2,
        cellTemplate: this.validatorActions
      }
    ];
  }

}
