import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TxResult } from 'src/app/shared/models/submit-transactions.model';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';
import { mergeMap } from 'rxjs/operators';

declare var ownBlockchainSdk: any;

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css'],
})
export class AddAccountComponent implements OnInit, OnDestroy {
  submissionErrors: string[];

  txResult: TxResult;
  wallet: WalletInfo;

  isKeyImported = false;
  isSubmited = false;

  txSub: Subscription;
  step = 1;

  constructor(private nodeService: NodeService, private privateKeyService: PrivatekeyService) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
  }

  submit() {
    this.txSub = this.nodeService
      .getAddressInfo(this.wallet.address)
      .pipe(
        mergeMap((balInfo) => {
          const nonce = balInfo.nonce + 1;
          const fee = this.nodeService.getMinFee();
          const txToSign = ownBlockchainSdk.transactions.createTx(this.wallet.address, nonce, fee);
          const accountHash = txToSign.addCreateAccountAction();
          const signature = txToSign.sign(environment.networkCode, this.wallet.privateKey);
          return this.nodeService.submitTransaction(signature);
        })
      )
      .subscribe((result) => {
        this.isSubmited = true;
        console.log(result);
        if (result.errors) {
          this.submissionErrors = result.errors;
          return;
        }
        this.txResult = result as TxResult;
      });
  }

  ngOnDestroy() {
    if (this.txSub) this.txSub.unsubscribe();
  }
}
