import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, filter, map, toArray, tap } from 'rxjs/operators';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { PrivatekeyService } from './../../services/privatekey.service';
import { NodeService } from './../../services/node.service';

import { WalletInfo } from 'src/app/models/wallet-info.model';
import { MyStakeInfo, MyStakes } from 'src/app/models/stakes-info.model';
import { ValidatorInfo } from './../../models/validators-info.model';
import { OwnAnimations } from '../../shared';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
  animations: [OwnAnimations.contentInOut]
})
export class StakingComponent implements OnInit {

  ColumnMode = ColumnMode;
  myStakesColumns = [
    {
      name: 'Validator address',
      prop: 'validatorAddress',
      flexGrow: 5
    },
    {
      name: 'Amount',
      prop: 'amount',
      flexGrow: 1
    }
  ];

  validatorsColumns = [
    {
      name: 'Validator address',
      prop: 'validatorAddress',
      flexGrow: 2
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
      flexGrow: 1
    }
  ];

  wallet: WalletInfo;
  isKeyImported = false;

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

    this.myStakes = this.nodeService.getChxAddressStakes(this.wallet.address);
    this.validators = this.nodeService.getValidators(false);

    this.delegated = this.myStakes.pipe(
      map(response => response.stakes),
      switchMap(stake => {
        if (stake.length === 0) { return []; }
        return this.validators.pipe(
        map(response => response.validators),
        filter(validator => stake.validatorAddress === validator.validatorAddress),
        map(result => {
          return {...result, amount: stake.amount };
        }));
      }),
        toArray()
    );

  }

}
