import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionInfo } from 'src/app/shared/models/transaction-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
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
  totalFee = 0;
  showErrorCode = false;
  ready = false;

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private ownModalService: OwnModalService
    ) { }

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
          this.txInfo = null;
          this.ownModalService.errors(info.errors);
          this.ownModalService.open('error-dialog');
          return;
        }
        this.txInfo = info as TransactionInfo;
        this.totalFee = (this.txInfo.actions) ? +(this.txInfo.actionFee * this.txInfo.actions.length).toFixed(1) : 0;
        this.showErrorCode = this.txInfo.errorCode &&
          ((isNaN(Number(this.txInfo.errorCode)) && this.txInfo.errorCode.length > 0) ||
            (!isNaN(Number(this.txInfo.errorCode)) && Number(this.txInfo.errorCode) > 0));
        this.ready = true;
      });
  }

  showTime(time: string): string {
    if (time) {
      return new Date(time).toISOString() + '<br>(' + time + ')';
    }
  }

  deriveHash(address: string, nonce: number, txActionNumber: number) {
    return this.cryptoService.deriveHash(address, nonce, txActionNumber);
  }

}
