import { Component, OnInit, Input } from '@angular/core';
import { AssetTransfer, TxAction } from '../../models/SubmitTransactions';
import { ActionRemoval } from '../../services/ActionRemovalService';

@Component({
  selector: 'app-asset-transfer',
  templateUrl: './asset-transfer.component.html',
  styleUrls: ['./asset-transfer.component.css']
})
export class AssetTransferComponent implements OnInit {
  @Input() assetTransfer : AssetTransfer; 
  @Input() removalService : ActionRemoval;
  constructor() { }

  ngOnInit() {
  }

  onRemoveAssetTransferClick(){
    if(this.removalService){
      this.removalService.removeAction(this.assetTransfer);
    }
  }

}
