import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { ChxAccountsInfo } from '../models/AddressInfo';

@Component({
  selector: 'app-address-account-info',
  templateUrl: './address-account-info.component.html',
  styleUrls: ['./address-account-info.component.css']
})
export class AddressAccountInfoComponent implements OnInit {
  chainiumAddress = '';
  errors: string[];
  addressInfo: ChxAccountsInfo;
  constructor(private nodeService: NodeService) { }

  ngOnInit() {
  }

  onAccountInfoButtonClick() {
    if (!this.chainiumAddress) {
      return;
    }

    this.nodeService.getChxAddressAccounts(this.chainiumAddress).subscribe(info => {
      if (!info || info.errors) {
        this.errors = info.errors;
        this.addressInfo = null;
        return;
      }

      this.errors = null;
      this.addressInfo = new ChxAccountsInfo();
      this.addressInfo.accounts = info.accounts;

      if (!this.addressInfo.accounts || this.addressInfo.accounts.length === 0) {
        this.errors = ['There are no accounts associated with this address'];
        this.addressInfo = null;
      }

    });
  }
}
