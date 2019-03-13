import { Component, OnInit, Input } from "@angular/core";
import { SetAccountController } from "src/app/models/SubmitTransactions";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-set-account-controller",
  templateUrl: "./set-account-controller.component.html",
  styleUrls: ["./set-account-controller.component.scss"]
})

export class SetAccountControllerComponent implements OnInit {
  @Input() setAccountController : SetAccountController;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveAccountControllerClick(){
    if(this.removalService){
      this.removalService.removeAction(this.setAccountController);
    }
  }
}