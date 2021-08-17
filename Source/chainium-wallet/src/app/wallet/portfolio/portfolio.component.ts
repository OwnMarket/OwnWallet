import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  addingNewAccount: boolean = false;
  accounts: Observable<string[]>;
  selectedAccount: string;

  wallet: WalletInfo;
  isKeyImported = false;

  constructor(private nodeService: NodeService, private privateKeyService: PrivatekeyService) {}

  ngOnInit(): void {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }

    this.wallet = this.privateKeyService.getWalletInfo();
    this.accounts = this.nodeService.getChxAddressAccounts(this.wallet.address).pipe(
      map((resp) => {
        if (resp && resp.accounts.length > 0) {
          this.selectedAccount = resp.accounts[0];
          return resp.accounts;
        } else {
          return [];
        }
      })
    );
  }

  selectAccount(account: string): void {
    this.selectedAccount = account;
  }

  addNewAccount() {
    this.addingNewAccount = true;
  }
}
