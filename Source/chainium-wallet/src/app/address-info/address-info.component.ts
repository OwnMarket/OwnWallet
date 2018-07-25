import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { ChxAccountsInfo } from '../models/AddressInfo';
import { ChxAddressInfo } from '../models/ChxAddressInfo';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit {
  chainiumAddress = '';
  errors: string[];
  accountsInfo: ChxAccountsInfo;
  addressInfo: ChxAddressInfo;
  constructor(private nodeService: NodeService) { }

  ngOnInit() {
  }

  onAddressInfoButtonClick() {
    if (!this.chainiumAddress) {
      return;
    }

    this.nodeService
      .getAddressInfo(this.chainiumAddress)
      .subscribe(addr => {
        if (!addr || addr.errors) {
          this.chainiumAddress = null;
          this.addressInfo = null;
          return;
        }
        this.addressInfo = addr as ChxAddressInfo;
      });

    this.nodeService.getChxAddressAccounts(this.chainiumAddress).subscribe(info => {
      if (!info || info.errors) {
        this.errors = info.errors;
        this.accountsInfo = null;
        return;
      }

      this.errors = null;
      this.accountsInfo = new ChxAccountsInfo();
      this.accountsInfo.accounts = info.accounts;
    });
  }
}
