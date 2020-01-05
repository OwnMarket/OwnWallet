import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AssetInfo } from 'src/app/models/asset-info.model';
import { NodeService } from 'src/app/services/node.service';
import { OwnAnimations } from '../../shared';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';

@Component({
  selector: 'app-asset-info',
  templateUrl: './asset-info.component.html',
  styleUrls: ['./asset-info.component.css'],
  animations: [ OwnAnimations.contentInOut ]
})

export class AssetInfoComponent implements OnInit {

  assetHash = '';
  assetInfo: AssetInfo;
  subscription: Subscription;

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private ownModalService: OwnModalService
    ) {}

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
        this.ownModalService.errors(info.errors);
        this.ownModalService.open('error-dialog');
        return;
      }
      this.assetInfo = info as AssetInfo;
    });
  }
}
