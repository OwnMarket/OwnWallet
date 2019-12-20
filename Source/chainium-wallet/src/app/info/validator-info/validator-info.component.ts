import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';

import { NodeService } from '../../services/node.service';
import { ValidatorsInfo } from '../../models/validators-info.model';
import { StakeInfo } from '../../models/stakes-info.model';

@Component({
  selector: 'app-validator-info',
  templateUrl: './validator-info.component.html',
  styleUrls: ['./validator-info.component.scss']
})

export class ValidatorInfoComponent implements OnInit, OnDestroy {

  ColumnMode = ColumnMode;

  validatorHash = '';
  validatorsInfo: ValidatorsInfo;
  subscription: Subscription;
  validatorStakes: any;
  errors: any;
  activeOnly = false;

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const validatorRouteHash = params['validatorHash'];
      this.validatorHash = (validatorRouteHash === null || validatorRouteHash === undefined) ? '' : validatorRouteHash;
      this.onValidatorInfoButtonClick();
    });
  }

  onValidatorInfoButtonClick() {
    if (this.validatorHash === '') {
      this.validatorStakes = null;
      this.nodeService
        .getValidators(this.activeOnly)
        .subscribe(info => {
          if (!info || info.errors) {
            this.validatorsInfo = null;
            this.errors = info.errors;
            return;
          }
          this.errors = null;
          this.validatorsInfo = info as ValidatorsInfo;
        });
    } else {
      this.validatorsInfo = null;
      this.nodeService
        .getValidatorStakes(this.validatorHash)
        .subscribe(stakes => {
          if (!stakes || stakes.errors) {
            this.validatorStakes = null;
            this.errors = stakes.errors;
            return;
          }
          this.errors = null;
          this.validatorStakes = stakes as StakeInfo;
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
