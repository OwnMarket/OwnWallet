import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NodeService } from '../services/node.service';
import { ChxAccountsInfo } from '../models/AddressInfo';
import { ChxAddressInfo } from '../models/ChxAddressInfo';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit, OnDestroy {
  chainiumAddress = '';
  errors: string[];
  accountsInfo: ChxAccountsInfo;
  addressInfo: ChxAddressInfo;
  routeSubscription: Subscription;

  constructor(private nodeService: NodeService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const chainiumAddress = params['addressHash'];
      this.chainiumAddress = chainiumAddress == null || chainiumAddress === undefined ? null : chainiumAddress;
      this.onAddressInfoButtonClick();
    });  
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
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
