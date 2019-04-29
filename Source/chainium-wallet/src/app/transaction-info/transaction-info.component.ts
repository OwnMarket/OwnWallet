import { Component, OnInit, OnDestroy } from '@angular/core';
import { NodeService } from '../services/node.service';
import { TransactionInfo } from '../models/transaction-info.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptoService } from '../services/crypto.service';

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
  totalFee: number = 0;
  showErrorCode: boolean = false;
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
}
