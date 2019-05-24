import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TxEnvelope, TxResult } from '../models/submit-transactions.model';
import { NodeService } from '../services/node.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-submit-transaction-info',
  templateUrl: './submit-transaction-info.component.html',
  styleUrls: ['./submit-transaction-info.component.css']
})
export class SubmitTransactionInfoComponent implements OnInit {
  transactionEnvelope: TxEnvelope;
  txtEnvelope: string;
  txResult: TxResult;
  submissionErrors: string[];
  isSubmited = false;

  constructor(
    public dialogRef: MatDialogRef<SubmitTransactionInfoComponent>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: TxEnvelope,
    private nodeService: NodeService) {
    this.transactionEnvelope = data;
    this.txtEnvelope = JSON.stringify(this.transactionEnvelope);
  }

  ngOnInit() {
  }

  onSubmitButtonClick() {
    this.nodeService.submitTransaction(this.transactionEnvelope).subscribe(result => {
      this.isSubmited = true;

      if (result.errors) {
        this.submissionErrors = result.errors;
        return;
      }

      this.txResult = (result as TxResult);

    });
  }

  onTransactionHashClick() {
    this.onCloseClick();
    this.router.navigate([`/tx/${this.txResult.txHash}`], { relativeTo: this.activatedRoute });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
