import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material';

import { Tx, ChxTransfer, TxAction, AssetTransfer, TxEnvelope } from '../models/SubmitTransactions'
import { PrivatekeyService } from '../services/privatekey.service';
import { NodeService } from '../services/node.service';
import { CryptoService } from '../services/crypto.service';
import { ActionRemoval } from '../services/ActionRemovalService';
import { SubmitTransactionInfoComponent } from '../submit-transaction-info/submit-transaction-info.component';
import { MatDialog } from '@angular/material';

interface ActionOption {
  value: string;
  viewValue: string;
  onSelected(): TxAction;
}

@Component({
  selector: 'app-submit-transaction',
  templateUrl: './submit-transaction.component.html',
  styleUrls: ['./submit-transaction.component.css']
})
export class SubmitTransactionComponent implements OnInit {
  tx: Tx;
  displayActions = false;
  availableActions: ActionOption[] =
    [
      {
        value: 'TransferChx',
        viewValue: 'Transfer Chx',
        onSelected() {
          let action = new TxAction();
          action.actionType = 'TransferChx';
          action.actionData = {
            recipientAddress: '',
            amount: null
          }
          return action;
        }
      },
      {
        value: 'TransferAsset',
        viewValue: 'Transfer Asset',
        onSelected() {
          const action = new TxAction();
          action.actionType = 'TransferAsset';

          const assetTransfer = {
            fromAccount: '',
            toAccount: '',
            assetHash: '',
            amount: 0
          };

          action.actionData = assetTransfer;
          return action;
        }
      },
    ]

  removalService: ActionRemoval;

  isKeyImported: boolean;
  constructor(private nodeService: NodeService, private privateKeyService: PrivatekeyService, private cryptoService: CryptoService, public dialog: MatDialog) {
    this.isKeyImported = privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    nodeService.getAddressInfo(this.privateKeyService.walletInfo.address)
      .subscribe(
        balInfo => {
          this.tx = new Tx();
          this.tx.nonce = balInfo.nonce + 1;
          this.tx.fee = nodeService.getMinFee();
          this.tx.actions = new Array<TxAction>();
          this.removalService = {
            tx: this.tx,
            removeAction: this.removeTxAction
          };
        });
  }

  validateTransaction(txAction: TxAction): boolean {
    if (!txAction || !txAction.actionData) {
      return false;
    }

    let notNullOrEmpty = (item) => typeof item != 'undefined' && item

    switch (txAction.actionType) {
      case "TransferChx":
        let chx = txAction.actionData as ChxTransfer;
        return chx.amount > 0 && notNullOrEmpty(chx.recipientAddress);
      case "TransferAsset":
        let asset = txAction.actionData as AssetTransfer;

        return asset.amount > 0
          && notNullOrEmpty(asset.assetHash)
          && notNullOrEmpty(asset.fromAccount)
          && notNullOrEmpty(asset.toAccount)
    }
  }

  onActionSelected(event: MatOptionSelectionChange, action: any) {
    if (event.source.selected) {
      let selected = this.availableActions.find(a => a.value == action.value);
      if (!selected) {
        return;
      }
      if (!this.tx.actions) {
        this.tx.actions = new Array<TxAction>();
      }

      let newAction = selected.onSelected();
      this.tx.actions.push(newAction);
      this.displayActions = this.tx.actions ? true : false;
    }
  }

  removeTxAction(txAction: object) {
    if (!this.tx.actions) {
      return;
    }

    let idxToRemove = this.tx.actions.findIndex(a => a.actionData === txAction);
    if (idxToRemove < 0) {
      return;
    }

    this.tx.actions.splice(idxToRemove, 1);
  }

  ngOnInit() {
  }

  public numOfValidActions(): number {
    if (!this.tx.actions) {
      return 0;
    }
    let valids = this.tx.actions.filter(ac => this.validateTransaction(ac));
    return valids.length;
  }

  private txEnvelope: TxEnvelope;
  openSubmissionDialog(): void {
    let txToSign = new Tx();
    txToSign.actions = this.tx.actions.filter(a => this.validateTransaction(a));
    txToSign.fee = this.tx.fee;
    txToSign.nonce = this.tx.nonce;


    this.cryptoService.signTransaction(this.privateKeyService.walletInfo.privateKey, txToSign).subscribe(env => this.loadSignedData(env));


  }

  private loadSignedData(env: TxEnvelope) {
    this.txEnvelope = env

    let dialogRef = this.dialog.open(SubmitTransactionInfoComponent, {
      width: '50%',
      data: this.txEnvelope
    });
  }

  totalFee(): number {
    return this.numOfValidActions() * this.tx.fee;
  }

}
