import { Component, OnInit } from "@angular/core";
import { NodeService } from "../services/node.service";
import { ValidatorsInfo } from "../models/ValidatorInfo.model";
import { StakeInfo } from "../models/StakesInfo.model";

@Component({
  selector: "app-validator-info",
  templateUrl: "./validator-info.component.html",
  styleUrls: ["./validator-info.component.scss"]
})

export class ValidatorInfoComponent implements OnInit {
  validatorHash: string = '';
  validatorsInfo: ValidatorsInfo;
  validatorStakes: any;
  errors;
  activeOnly = false;

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
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
    }
    else {
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
        })
    }
  }
}
