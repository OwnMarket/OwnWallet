import { Component, OnInit } from '@angular/core';
import { EquivocationProofInfo } from '../../shared/models/equivocation-proof-info.model';
import { Subscription } from 'rxjs';
import { NodeService } from '../../shared/services/node.service';
import { ActivatedRoute } from '@angular/router';
import { OwnModalService } from './../../shared/own-modal/services/own-modal.service';

@Component({
  selector: 'app-equivocation-proof-info',
  templateUrl: './equivocation-proof-info.component.html',
  styleUrls: ['./equivocation-proof-info.component.scss']
})

export class EquivocationProofInfoComponent implements OnInit {

  equivocationProofHash = '';
  equivocationProofInfo: EquivocationProofInfo;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private nodeService: NodeService,
    private ownModalService: OwnModalService
    ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const equivocationProofRouteHash = params['equivocationProofHash'];
      this.equivocationProofHash = (equivocationProofRouteHash === null || equivocationProofRouteHash === undefined) ? '' : equivocationProofRouteHash;
      this.getEquivocationProofInfo();
    });
  }

  getEquivocationProofInfo() {
    if (this.equivocationProofHash === '') {
      return;
    }
    this.nodeService.getequivocationProofInfo(this.equivocationProofHash)
      .subscribe(info => {
        if (!info || info.errors) {
          this.equivocationProofInfo = null;
          this.ownModalService.errors(info.errors);
          this.ownModalService.open('error-dialog');
          return;
        }
        this.equivocationProofInfo = info as EquivocationProofInfo;
      });
  }
}
