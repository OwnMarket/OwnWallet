import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { BlockInfo } from '../models/BlockInfo';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.css']
})
export class BlockInfoComponent implements OnInit {

  blockNumber = 0;
  blockInfo: BlockInfo;
  errors: string[];
  constructor(private nodeService: NodeService) { }


  ngOnInit() {
  }

  onBlockInfoButtonClick() {
    if (this.blockNumber.toString() === '') {
      return;
    }

    this.nodeService.getBlockInfo(this.blockNumber).subscribe(info => {
      if (!info || info.errors) {
        this.blockInfo = null;
        this.errors = info.errors;
        return;
      }
      info.blockTime = new Date(info.timestamp * 1000).toISOString(); // Block timestamp is Unix time (seconds).
      this.errors = null;
      this.blockInfo = info as BlockInfo;
    });
  }

}
