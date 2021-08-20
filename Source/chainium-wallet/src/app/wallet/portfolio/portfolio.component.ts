import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { contentInOut, flyUpDown } from 'src/app/shared/animations/router.animations';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  animations: [flyUpDown, contentInOut],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  addingNewAccount: boolean = false;
  addingNewAsset: boolean = false;
  settingController: boolean = false;
  transferingAsset: boolean = false;
  accounts: Observable<string[]>;
  selectedAccount: string;
  selectedAsset: string;
  selectedAssetBalance: number;
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

  fetchAccountsWithInfo(transfered?: boolean): void {
    if (transfered) this.selectAccount = null;
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
    this.close();
    this.fetchAccountInfo();
  }

  addNewAccount(): void {
    this.close();
    this.addingNewAccount = true;
  }

  close(): void {
    this.addingNewAccount = false;
    this.addingNewAsset = false;
    this.settingController = false;
    this.transferingAsset = false;
  }

  onNewAccountAdded(accHash: string): void {
    this.addingNewAccount = false;
    this.selectedAccount = accHash;
    this.fetchAccountsWithInfo();
  }

  addNewAsset(): void {
    this.close();
    this.addingNewAsset = true;
  }

  onNewAssetAdded(assetHash: string): void {
    this.addingNewAsset = false;
    this.fetchAccountsWithInfo();
  }

  setAccountController(event: any): void {
    event.stopPropagation();
    this.close();
    this.settingController = true;
  }

  onControllerSet(): void {
    this.close();
    this.fetchAccountsWithInfo(true);
  }

  transferAsset(assetHash: string, assetBalance: number): void {
    this.selectedAsset = assetHash;
    this.selectedAssetBalance = assetBalance;
    this.transferingAsset = true;
  }

  copy(event: any): void {
    event.stopPropagation();
  }
}
