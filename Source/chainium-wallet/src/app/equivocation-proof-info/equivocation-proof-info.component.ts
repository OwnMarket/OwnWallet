import { Component, OnInit } from "@angular/core";
import { EquivocationProofInfo } from "../models/equivocation-proof-info.model";
import { Subscription } from "rxjs";
import { NodeService } from "../services/node.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-equivocation-proof-info",
  templateUrl: "./equivocation-proof-info.component.html",
  styleUrls: ["./equivocation-proof-info.component.scss"]
})

export class EquivocationProofInfoComponent implements OnInit {
  equivocationProofHash: string = '';
  equivocationProofInfo: EquivocationProofInfo;
  subscription: Subscription;
  errors;
  constructor(private nodeService: NodeService,
    private route: ActivatedRoute) {
  }

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
    this.nodeService.getequivocationProofInfo(this.equivocationProofHash).subscribe(info => {
      if (!info || info.errors) {
        this.equivocationProofInfo = null;
        this.errors = info.errors;
        return;
      }
      this.errors = null;
      this.equivocationProofInfo = info as EquivocationProofInfo;
    });
  }
}
