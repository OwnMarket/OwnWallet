import { Component, OnInit, Input } from "@angular/core";
import { RemoveValidator } from "src/app/models/submit-transactions.model";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-remove-validator",
  templateUrl: "./remove-validator.component.html",
  styleUrls: ["./remove-validator.component.scss"]
})

export class RemoveValidatorComponent implements OnInit {
  
  @Input() removeValidator : RemoveValidator;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onCancelRemoveValidatorClick(){
    if(this.removalService){
      this.removalService.removeAction(this.removeValidator);
    }
  }
}
