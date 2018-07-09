import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { TxResult, TxEnvelope, TxAction, Tx } from '../models/SubmitTransactions';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivatekeyService } from '../services/privatekey.service';
import { CryptoService } from '../services/crypto.service';
import { ChxAddressInfo } from '../models/ChxAddressInfo';

@Component({
  selector: 'app-generate-account',
  templateUrl: './generate-account.component.html',
  styleUrls: ['./generate-account.component.css']
})
export class GenerateAccountComponent implements OnInit {
  errors: string[];
  txResult: TxResult;
  isKeyImported: boolean;
  private balInfo: ChxAddressInfo;
  private envelope: TxEnvelope;
  constructor(private nodeService: NodeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService) {

    this.isKeyImported = privateKeyService.existsKey();
  }

  ngOnInit() {
  }

  private errorsOrResult<T>(result: any): T {
    if (!result || result.errors) {
      this.errors = result.errors;
      return null;
    }

    return (result as T);
  }

  private composeTx(nonce: number, senderAddress: string): Tx {
    const action = new TxAction();
    action.actionType = 'CreateAccount';
    action.actionData = {};

    const tx = new Tx();
    tx.fee = this.nodeService.getMinFee();
    tx.senderAddress = senderAddress;
    tx.actions = [action];
    tx.nonce = nonce;

    return tx;
  }

  onGenerateAccountClick() {
    if (!this.privateKeyService.existsKey) {
      return;
    }

    this.nodeService.getAddressInfo(this.privateKeyService.walletInfo.address)
      .subscribe(info => {
        this.balInfo = this.errorsOrResult<ChxAddressInfo>(info);

        if (!this.balInfo) {
          return;
        }

        if (this.balInfo.balance <= 0) {
          this.errors = ['Your balance is insufficient to cover address creation fee'];
          return;
        }

        const tx = this.composeTx(this.balInfo.nonce + 1, this.privateKeyService.walletInfo.address);
        this.cryptoService.signTransaction(this.privateKeyService.walletInfo.privateKey, tx)
          .subscribe(signData => {
            this.envelope = this.errorsOrResult<TxEnvelope>(signData);

            if (!this.envelope) {
              return;
            }

            this.nodeService.submitTransaction(this.envelope)
              .subscribe(result => { this.txResult = this.errorsOrResult<TxResult>(result); });
          });



      });
  }

  onTransactionHashClick() {
    this.router.navigate([`/transaction/${this.txResult.txHash}`], { relativeTo: this.activatedRoute });
  }

}
