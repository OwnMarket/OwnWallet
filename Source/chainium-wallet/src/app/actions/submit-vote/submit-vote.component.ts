import { Component, OnInit, Input } from "@angular/core";
import { SubmitVote } from "src/app/models/submit-transactions.model";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-submit-vote",
  templateUrl: "./submit-vote.component.html",
  styleUrls: ["./submit-vote.component.scss"]
})

export class SubmitVoteComponent implements OnInit {
  
  @Input() submitVote : SubmitVote;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveSubmitVoteClick(){
    if(this.removalService){
      this.removalService.removeAction(this.submitVote);
    }
  }
}