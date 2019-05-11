import { Component, OnInit } from "@angular/core";
import { NodeService } from "../services/node.service";
import { AssetInfo } from "../models/asset-info.model";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-asset-info",
  templateUrl: "./asset-info.component.html",
  styleUrls: ["./asset-info.component.css"]
})

export class AssetInfoComponent implements OnInit {
  assetHash: string = '';
  assetInfo: AssetInfo;
  subscription: Subscription;
  errors;
  constructor(private nodeService: NodeService,
    private route: ActivatedRoute) { 
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const assetRouteHash = params['assetHash'];
      this.assetHash = (assetRouteHash === null || assetRouteHash === undefined) ? '' : assetRouteHash;
      this.onAssetInfoButtonClick();
    });
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
