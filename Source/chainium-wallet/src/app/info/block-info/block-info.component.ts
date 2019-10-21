import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlockInfo } from 'src/app/models/block-info.model';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BlockInfoComponent implements OnInit, OnDestroy {

  blockNumber = 0;
  blockInfo: BlockInfo;
  subscription: Subscription;
  errors: string[];
  showStakingRewards: boolean;

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const blockNo = params['blockNumber'];

      if (blockNo === undefined || blockNo === null) {
        this.blockNumber = null;
        this.nodeService.getLatestBlockNumber().subscribe(latestBlockNo => {
          if (latestBlockNo && !isNaN(Number.parseInt(latestBlockNo))) {
            this.blockNumber = latestBlockNo;
          }
        });
      } else {
        this.blockNumber = blockNo;
      }

      this.onBlockInfoButtonClick();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onBlockInfoButtonClick() {

    if (this.blockNumber < 0 || this.blockNumber === null) { return; }

    this.nodeService.getBlockInfo(this.blockNumber).subscribe(info => {
      if (!info || info.errors) {
        this.blockInfo = null;
        this.errors = info.errors;
        return;
      }

      const timestamp = info.timestamp > 2 ** 32 ? info.timestamp : info.timestamp * 1000; // New version in milliseconds.

      if (timestamp === 0) {
        info.blockTime = '';
      } else {
        info.blockTime = new Date(timestamp).toISOString(); // Block timestamp is Unix time.
        info.timestamp = `(${info.timestamp})`;
      }

      this.errors = null;
      this.blockInfo = info as BlockInfo;
      this.showStakingRewards =
        this.blockInfo.stakingRewards
        && this.blockInfo.stakingRewards.length > 0
        && this.blockInfo.stakingRewards.some(r => r.amount > 0);
    });
  }
}
