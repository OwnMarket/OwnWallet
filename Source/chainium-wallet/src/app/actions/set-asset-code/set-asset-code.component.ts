import { Component, OnInit, Input } from "@angular/core";
import { ActionRemoval } from "src/app/services/ActionRemovalService";
import { SetAssetCode } from "src/app/models/SubmitTransactions";

@Component({
  selector: "app-set-asset-code",
  templateUrl: "./set-asset-code.component.html",
  styleUrls: ["./set-asset-code.component.scss"]
})

export class SetAssetCodeComponent implements OnInit {
  
  @Input() setAssetCode : SetAssetCode;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveAssetCodeClick(){
    if(this.removalService){
      this.removalService.removeAction(this.setAssetCode);
    }
  }
}
