import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionInfo } from 'src/app/models/transaction-info.model';
import { NodeService } from 'src/app/services/node.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { OwnAnimations } from '../../shared';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.css'],
  animations: [ OwnAnimations.contentInOut ]
})
export class TransactionInfoComponent implements OnInit, OnDestroy {

  actionsExpanded = false;
  expandedTransactionActions: any;
  selectedActions: any;

  transactionHash = '';
  txInfo: TransactionInfo;
  subscription: Subscription;
  errors: string[];
  totalFee = 0;
  showErrorCode = false;
  ready = false;

  constructor(private nodeService: NodeService,
    private route: ActivatedRoute,
    private cryptoService: CryptoService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const tHash = params['transactionHash'];
      this.transactionHash = (tHash == null || tHash === undefined) ? '' : tHash;
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
        this.totalFee = (this.txInfo.actions) ? (this.txInfo.actionFee * this.txInfo.actions.length) : 0;
        this.showErrorCode = this.txInfo.errorCode &&
          ((isNaN(Number(this.txInfo.errorCode)) && this.txInfo.errorCode.length > 0) ||
            (!isNaN(Number(this.txInfo.errorCode)) && Number(this.txInfo.errorCode) > 0));
        this.ready = true;
      });
  }

  deriveHash(address: string, nonce: number, txActionNumber: number) {
    return this.cryptoService.deriveHash(address, nonce, txActionNumber);
  }

  expandActions(val: boolean) {
    this.actionsExpanded = !this.actionsExpanded;
  }

  expandActionData(action: any, index: number) {
    this.expandedTransactionActions = {};
    if (action && action.actionData) {
      if (action.actionType === 'CreateAsset' || action.actionType === 'CreateAccount') {
        this.expandedTransactionActions.isEmpty = false;
        const hash = this.deriveHash(this.txInfo.senderAddress, this.txInfo.nonce, index + 1);
        const label = action.actionType === 'CreateAsset' ? 'assetHash' : 'accountHash';
        this.expandedTransactionActions = JSON.parse(`{"${label}": "${hash}"}`);
      } else {
        this.expandedTransactionActions = action.actionData;
      }
      if (this.selectedActions !== action) {
        this.expandedTransactionActions.custom_index = index;
        this.expandedTransactionActions.isEmpty = Object.keys(this.expandedTransactionActions).length === 1;
        this.selectedActions = action;
      } else {
        this.selectedActions = {};
      }
    }

  }

}
