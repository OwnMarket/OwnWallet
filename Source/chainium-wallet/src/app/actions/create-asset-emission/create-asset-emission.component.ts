import { Component, OnInit, Input } from "@angular/core";
import { CreateAssetEmission } from "src/app/models/submit-transactions.model";
import { ActionRemoval } from "src/app/services/ActionRemovalService";

@Component({
  selector: "app-create-asset-emission",
  templateUrl: "./create-asset-emission.component.html",
  styleUrls: ["./create-asset-emission.component.scss"]
})

export class CreateAssetEmissionComponent implements OnInit {
  
  @Input() assetEmission : CreateAssetEmission;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveAssetEmissionClick(){
    if(this.removalService){
      this.removalService.removeAction(this.assetEmission);
    }
  }
}
