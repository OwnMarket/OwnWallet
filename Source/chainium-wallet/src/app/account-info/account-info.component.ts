import { Component, OnInit } from '@angular/core';
import { AccountInfo } from '../models/AccountInfo';
import { NodeService } from '../services/node.service'

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  accountInfo : AccountInfo;
  accountHash : string;
  displayedColumns : string[];
  errors : string[];
  constructor(private nodeService : NodeService) { 
    this.accountHash = '';
    this.displayedColumns = ['assetcode','balance'];
  }

  ngOnInit() {
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
