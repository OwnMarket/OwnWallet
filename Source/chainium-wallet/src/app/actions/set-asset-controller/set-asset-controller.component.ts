import { Component, OnInit, Input } from "@angular/core";
import { ActionRemoval } from "src/app/services/ActionRemovalService";
import { SetAssetController } from "src/app/models/submit-transactions.model";

@Component({
  selector: "app-set-asset-controller",
  templateUrl: "./set-asset-controller.component.html",
  styleUrls: ["./set-asset-controller.component.scss"]
})

export class SetAssetControllerComponent implements OnInit {
  
  @Input() setAssetController : SetAssetController;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveAssetControllerClick(){
    if(this.removalService){
      this.removalService.removeAction(this.setAssetController);
    }
  }
}

