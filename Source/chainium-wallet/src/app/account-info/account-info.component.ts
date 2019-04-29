import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountInfo } from '../models/account-info.model';
import { NodeService } from '../services/node.service'

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  accountInfo : AccountInfo;
  accountHash : string;
  displayedColumns : string[];
  errors : string[];
  routeSubscription: Subscription;
  
  constructor(private nodeService : NodeService, private route: ActivatedRoute) { 
    this.accountHash = '';
    this.displayedColumns = ['assetcode','balance'];
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

  onAccountInfoButtonClick(){
    if(!this.accountHash){
      return;
    }
    this.nodeService.getAccountInfo(this.accountHash)
      .subscribe
      (
        info => {
          if(!info || info.errors){
            this.errors = info.errors;
            this.accountInfo = null;
            return;
          }
          this.errors = null;
          this.accountInfo = info as AccountInfo;
        }
      );
  }

}
