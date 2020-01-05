import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountInfo } from 'src/app/shared/models/account-info.model';
import { NodeService } from 'src/app/shared/services/node.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { OwnAnimations } from '../../shared';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
  animations: [ OwnAnimations.contentInOut ]
})
export class AccountInfoComponent implements OnInit, OnDestroy {

  accountInfo: AccountInfo;
  accountHash: string;
  displayedColumns: string[];
  routeSubscription: Subscription;

  ColumnMode = ColumnMode;
  columns = [
    {
      name: 'Asset Hash',
      prop: 'assetHash',
      flexGrow: 5
     },
    {
      name: 'Balance',
      prop: 'balance',
      sortable: true,
      flexGrow: 1
    }
  ];

  constructor(
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private ownModalService: OwnModalService
    ) {
    this.accountHash = '';
    this.displayedColumns = ['assetcode', 'balance'];
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const accountHash = params['accountHash'];
      this.accountHash = accountHash == null || accountHash === undefined ? null : accountHash;
      this.onAccountInfoButtonClick();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onAccountInfoButtonClick() {
    if (!this.accountHash) {
      return;
    }
    this.nodeService.getAccountInfo(this.accountHash)
      .subscribe
      (
        info => {
          if (!info || info.errors) {
            this.ownModalService.errors(info.errors);
            this.ownModalService.open('error-dialog');
            this.accountInfo = null;
            return;
          }
          this.accountInfo = info as AccountInfo;
        }
      );
  }

}
