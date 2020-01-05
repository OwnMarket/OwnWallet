import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChxAccountsInfo } from 'src/app/models/address-info.model';
import { ChxAddressInfo } from 'src/app/models/chx-address-info.model';
import { NodeService } from 'src/app/services/node.service';
import { StakesInfo, StakeInfo } from 'src/app/models/stakes-info.model';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { OwnAnimations } from '../../shared';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css'],
  animations: [ OwnAnimations.contentInOut ]
})
export class AddressInfoComponent implements OnInit, OnDestroy {

  blockchainAddress = '';
  accountsInfo: ChxAccountsInfo;
  addressInfo: ChxAddressInfo;
  assetsInfo: any;
  stakeInfo: any;
  routeSubscription: Subscription;
  ready = false;

  ColumnMode = ColumnMode;

  stakeColumns = [
    {
      name: 'Validator address',
      prop: 'validatorAddress',
      flexGrow: 5
    },
    {
      name: 'Amount',
      prop: 'amount',
      flexGrow: 1
    }
  ];

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private ownModalService: OwnModalService
    ) { }

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
          this.ownModalService.errors(addr.errors);
          this.ownModalService.open('error-dialog');
          return;
        }
        this.addressInfo = addr as ChxAddressInfo;
        this.nodeService
          .getChxAddressAssets(this.blockchainAddress)
          .subscribe(assets => {
            if (!assets || assets.errors) {
              this.assetsInfo = null;
              this.ownModalService.errors(assets.errors);
              this.ownModalService.open('error-dialog');
              this.ready = true;
              return;
            }
            this.assetsInfo = assets;
            this.nodeService
              .getChxAddressStakes(this.blockchainAddress)
              .subscribe(stakes => {
                this.stakeInfo = stakes as StakesInfo;
                this.sortStakes('amount', 'DESC');
                this.ready = true;
              });
          });
      });

    this.nodeService.getChxAddressAccounts(this.blockchainAddress).subscribe(info => {
      if (!info || info.errors) {
        this.accountsInfo = null;
        this.ownModalService.errors(info.errors);
        this.ownModalService.open('error-dialog');
        return;
      }

      this.accountsInfo = new ChxAccountsInfo();
      this.accountsInfo.accounts = info.accounts;
    });
  }

  sortStakes(propName: keyof StakeInfo, order: 'ASC' | 'DESC'): void {
    this.stakeInfo.stakes.sort((a: number, b: number) => {

      if (a[propName] < b[propName]) {
        return -1;
      }

      if (a[propName] > b[propName]) {
        return 1;
      }

      return 0;

    });

    if (order === 'DESC') {
      this.stakeInfo.stakes.reverse();
    }
  }
}
