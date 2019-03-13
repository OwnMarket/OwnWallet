import { Component, OnInit, Input } from "@angular/core";
import { CreateAsset } from "src/app/models/SubmitTransactions";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-create-asset",
  templateUrl: "./create-asset.component.html",
  styleUrls: ["./create-asset.component.scss"]
})

export class CreateAssetComponent implements OnInit {
  
  @Input() createAsset : CreateAsset;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveCreateAssetClick(){
    if(this.removalService){
      this.removalService.removeAction(this.createAsset);
    }
  }
}
