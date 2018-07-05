import { Component, OnInit, Input } from '@angular/core';
import { ChxTransfer } from '../../models/SubmitTransactions';
import { ActionRemoval } from '../../services/ActionRemovalService';

@Component({
  selector: 'app-chx-transfer',
  templateUrl: './chx-transfer.component.html',
  styleUrls: ['./chx-transfer.component.css']
})
export class ChxTransferComponent implements OnInit {
  @Input() chxTransfer : ChxTransfer;
  @Input() removalService : ActionRemoval;

  constructor() { }

  ngOnInit() {
  }

  onRemoveChxTransferClick(){
    if(this.removalService){
      this.removalService.removeAction(this.chxTransfer);
    }
  }

}
