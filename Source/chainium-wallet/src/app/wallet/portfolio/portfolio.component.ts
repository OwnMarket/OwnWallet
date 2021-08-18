import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { flyUpDown } from 'src/app/shared/animations/router.animations';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  animations: [flyUpDown],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  addingNewAccount: boolean = false;
  addingNewAsset: boolean = false;
  accounts: Observable<string[]>;
  selectedAccount: string;
  accInfoSub: Subscription;
  accInfo: any;

  wallet: WalletInfo;
  isKeyImported = false;

  constructor(private nodeService: NodeService, private privateKeyService: PrivatekeyService) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
    this.fetchAccountsWithInfo();
  }

  ngOnDestroy(): void {
    if (this.accInfoSub) this.accInfoSub.unsubscribe();
  }

  fetchAccountsWithInfo(): void {
    this.accounts = this.nodeService.getChxAddressAccounts(this.wallet.address).pipe(
      mergeMap((resp) => {
        if (resp && resp.accounts.length > 0) {
          if (!this.selectedAccount) {
            this.selectedAccount = resp.accounts[0];
          }
          return this.nodeService.getAccountInfo(this.selectedAccount).pipe(
            map((infoResp) => {
              this.accInfo = infoResp;
              return resp.accounts;
            })
          );
        } else {
          return [];
        }
      })
    );
  }

  fetchAccountInfo(): void {
    this.accInfoSub = this.nodeService.getAccountInfo(this.selectedAccount).subscribe((resp) => {
      this.accInfo = resp;
    });
  }

  selectAccount(account: string): void {
    this.selectedAccount = account;
    this.fetchAccountInfo();
  }

  addNewAccount(): void {
    if (this.addingNewAsset) this.addingNewAsset = false;
    this.addingNewAccount = true;
  }

  close(): void {
    console.log('closed');
    this.addingNewAccount = false;
    this.addingNewAsset = false;
  }

  onNewAccountAdded(accHash: string): void {
    this.addingNewAccount = false;
    this.selectedAccount = accHash;
    this.fetchAccountsWithInfo();
  }

  addNewAsset() {
    if (this.addNewAccount) this.addingNewAccount = false;
    this.addingNewAsset = true;
  }

  onNewAssetAdded(assetHash: string): void {
    this.addingNewAsset = false;
    this.fetchAccountsWithInfo();
  }

  copy(event: any): void {
    event.stopPropagation();
  }
}
