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
      this.errors = null;
      this.blockInfo = info as BlockInfo;
    });
  }

}
