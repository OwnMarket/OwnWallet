import { Component, OnInit } from "@angular/core";
import { NodeService } from "../services/node.service";
import { AssetInfo } from "../models/AssetInfo.model";

@Component({
  selector: "app-asset-info",
  templateUrl: "./asset-info.component.html",
  styleUrls: ["./asset-info.component.scss"]
})

export class AssetInfoComponent implements OnInit {
  assetHash: string = '';
  assetInfo: AssetInfo;
  errors;
  constructor(private nodeService: NodeService) { 
  }

  ngOnInit() {
  }

  onAssetInfoButtonClick() {
    if (this.assetHash === '') {
      return;
    }
    this.nodeService.getAssetInfo(this.assetHash).subscribe(info => {
      if (!info || info.errors) {
        this.assetInfo = null;
        this.errors = info.errors;
        return;
      }
      this.errors = null;
      this.assetInfo = info as AssetInfo;
    });
  }
}
