import { Component, OnInit, Input } from "@angular/core";
import { ConfigureValidator } from "src/app/models/SubmitTransactions";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-configure-validator",
  templateUrl: "./configure-validator.component.html",
  styleUrls: ["./configure-validator.component.scss"]
})

export class ConfigureValidatorComponent implements OnInit {
  
  @Input() configureValidator : ConfigureValidator;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveConfigureValidatorClick(){
    if(this.removalService){
      this.removalService.removeAction(this.configureValidator);
    }
  }
}
