import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { BlockInfo } from '../models/BlockInfo';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.css']
})
export class BlockInfoComponent implements OnInit {

  blockNumber = 0;
  blockInfo: BlockInfo;
  subscription: Subscription;
  errors: string[];
  constructor(private nodeService: NodeService,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const blockNo = params['blockNumber'];
      this.blockNumber = (blockNo === null || blockNo === undefined) ? null : blockNo;
      this.onBlockInfoButtonClick();
    });
  }

  onBlockInfoButtonClick() {
    if (this.blockNumber < 0 || this.blockNumber === null) {
      return;
    }

    this.nodeService.getBlockInfo(this.blockNumber).subscribe(info => {
      if (!info || info.errors) {
        this.blockInfo = null;
        this.errors = info.errors;
        return;
      }
      let timestamp = info.timestamp > 2 ** 32 ? info.timestamp : info.timestamp * 1000; // New version in milliseconds.
      info.blockTime = new Date(timestamp).toISOString(); // Block timestamp is Unix time.
      this.errors = null;
      this.blockInfo = info as BlockInfo;
    });
  }

}
