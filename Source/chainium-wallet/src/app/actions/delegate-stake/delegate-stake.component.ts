import { Component, OnInit, Input } from "@angular/core";
import { ActionRemoval } from "src/app/services/ActionRemovalService";
import { DelegateStake } from "src/app/models/SubmitTransactions";

@Component({
  selector: "app-delegate-stake",
  templateUrl: "./delegate-stake.component.html",
  styleUrls: ["./delegate-stake.component.scss"]
})

export class DelegateStakeComponent implements OnInit {
  
  @Input() delegateStake : DelegateStake;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveDelegateStakeClick(){
    if(this.removalService){
      this.removalService.removeAction(this.delegateStake);
    }
  }
}
