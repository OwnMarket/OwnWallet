import { Component, OnInit, Input } from "@angular/core";
import { CreateAccount } from "src/app/models/submit-transactions.model";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"]
})

export class CreateAccountComponent implements OnInit {
  
  @Input() createAccount : CreateAccount;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveCreateAccountClick(){
    if(this.removalService){
      this.removalService.removeAction(this.createAccount);
    }
  }
}
