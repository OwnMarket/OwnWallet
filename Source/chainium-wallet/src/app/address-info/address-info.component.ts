import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NodeService } from '../services/node.service';
import { ChxAccountsInfo } from '../models/address-info.model';
import { ChxAddressInfo } from '../models/chx-address-info.model';
import { StakesInfo, StakeInfo } from '../models/stakes-info.model';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit, OnDestroy {
  blockchainAddress = '';
  errors: string[];
  accountsInfo: ChxAccountsInfo;
  addressInfo: ChxAddressInfo;
  assetsInfo: any;
  stakeInfo: any;
  routeSubscription: Subscription;
  ready = false;

  constructor(private nodeService: NodeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const blockchainAddress = params['addressHash'];
      this.blockchainAddress = blockchainAddress == null || blockchainAddress === undefined ? null : blockchainAddress;
      this.onAddressInfoButtonClick();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onAddressInfoButtonClick() {
    if (!this.blockchainAddress) {
      return;
    }

    this.nodeService
      .getAddressInfo(this.blockchainAddress)
      .subscribe(addr => {
        if (!addr || addr.errors) {
          this.blockchainAddress = null;
          this.addressInfo = null;
          return;
        }
        this.addressInfo = addr as ChxAddressInfo;
        this.nodeService
          .getChxAddressAssets(this.blockchainAddress)
          .subscribe(assets => {
            if (!assets || assets.errors) {
              this.assetsInfo = null;
              this.ready = true;
              return;
            }
            this.assetsInfo = assets;
            this.nodeService
              .getChxAddressStakes(this.blockchainAddress)
              .subscribe(stakes => {
                this.stakeInfo = stakes as StakesInfo;
                this.sortStakes("amount","DESC");
                this.ready = true;
              })
          });
      });

    this.nodeService.getChxAddressAccounts(this.blockchainAddress).subscribe(info => {
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

  sortStakes(propName: keyof StakeInfo, order: "ASC" | "DESC"): void {
    this.stakeInfo.stakes.sort((a, b) => {
      if (a[propName] < b[propName])
        return -1;
      if (a[propName] > b[propName])
        return 1;
      return 0;
    });
    if (order === "DESC") {
      this.stakeInfo.stakes.reverse();
    }
  }
}
