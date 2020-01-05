import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';

import { NodeService } from '../../shared/services/node.service';
import { ValidatorsInfo } from '../../shared/models/validators-info.model';
import { StakeInfo } from '../../shared/models/stakes-info.model';
import { OwnAnimations } from '../../shared';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';

@Component({
  selector: 'app-validator-info',
  templateUrl: './validator-info.component.html',
  styleUrls: ['./validator-info.component.scss'],
  animations: [ OwnAnimations.contentInOut ]
})

export class ValidatorInfoComponent implements OnInit, OnDestroy {

  ColumnMode = ColumnMode;

  validatorHash = '';
  validatorsInfo: ValidatorsInfo;
  subscription: Subscription;
  validatorStakes: any;
  activeOnly = false;

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private ownModalService: OwnModalService
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
            this.ownModalService.errors(info.errors);
            this.ownModalService.open('error-dialog');
            return;
          }
          this.validatorsInfo = info as ValidatorsInfo;
        });
    } else {
      this.validatorsInfo = null;
      this.nodeService
        .getValidatorStakes(this.validatorHash)
        .subscribe(stakes => {
          if (!stakes || stakes.errors) {
            this.validatorStakes = null;
            this.ownModalService.errors(stakes.errors);
            this.ownModalService.open('error-dialog');
            return;
          }
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
