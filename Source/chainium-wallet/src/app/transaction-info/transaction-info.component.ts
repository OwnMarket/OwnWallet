import { Component, OnInit, OnDestroy } from '@angular/core';
import { NodeService } from '../services/node.service';
import { TransactionInfo } from '../models/TransactionInfo';
import { TxAction, ChxTransfer, AssetTransfer, TxResult } from '../models/SubmitTransactions';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

interface ActionTypeMapper {
  actionType: string;
  map(actionData: any): string;
}

const ACTIONTYPEMAPPERS: ActionTypeMapper[] =
  [
    {
      actionType: 'ChxTransfer',
      map(actionData: any): string {
        const chxTransfer = actionData as ChxTransfer;

        if (!chxTransfer) {
          return '';
        }

        return `Transfer of ${chxTransfer.amount} CHX to ${chxTransfer.recipientAddress}`;
      }
    },
    {
      actionType: 'AssetTransfer',
      map(actionData: any): string {
        const assetTransfer = actionData as AssetTransfer;

        if (!assetTransfer) {
          return '';
        }

        return `Transfer ${assetTransfer.amount} of ${assetTransfer.assetHash} from ${assetTransfer.fromAccount} to ${assetTransfer.toAccount}`;
      }
    }
  ];

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.css']
})
export class TransactionInfoComponent implements OnInit, OnDestroy {
  transactionHash = '';
  txInfo: TransactionInfo;
  subscription: Subscription;
  errors: string[];
  transactionStatus = '';

  constructor(private nodeService: NodeService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const tHash = params['transactionHash'];
      this.transactionHash = tHash == null || tHash === undefined ? '' : tHash;
      this.onTransactionInfoButtonClick();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onTransactionInfoButtonClick(): void {
    if (!this.transactionHash) {
      return;
    }
    this.nodeService
      .getTransactionInfo(this.transactionHash)
      .subscribe(info => {
        if (!info || info.errors) {
          this.errors = info.errors;
          this.txInfo = null;
          return;
        }
        this.errors = null;
        this.txInfo = info as TransactionInfo;
        this.transactionStatus = this.mapStatus(this.txInfo.status);
      });
  }

  private mapStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Success';
      case 2:
        return 'Failed';
    }

    return 'Unknown';

  }

  mapAction(action: TxAction): string {
    const mapper = ACTIONTYPEMAPPERS.find(el => el.actionType === action.actionType);

    if (!mapper) {
      return JSON.stringify(action);
    }

    return mapper.map(action.actionData);
  }

}
