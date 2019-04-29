import { Component, OnInit, Input } from "@angular/core";
import { SubmitVoteWeight } from "src/app/models/submit-transactions.model";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-submit-vote-weight",
  templateUrl: "./submit-vote-weight.component.html",
  styleUrls: ["./submit-vote-weight.component.scss"]
})

export class SubmitVoteWeightComponent implements OnInit {
  
  @Input() submitVoteWeight : SubmitVoteWeight;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveSubmitVoteWeightClick(){
    if(this.removalService){
      this.removalService.removeAction(this.submitVoteWeight);
    }
  }
}