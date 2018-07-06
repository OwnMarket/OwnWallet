import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { GlobalErrorHandler } from './services/global.error.handler';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { FaucetService } from './services/faucet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {
  title = 'app';
  errorOccuredSubscription: Subscription;
  chainiumAddress = '';
  addressHash = '';
  messages: string[];

  constructor(
    private errorHandler: GlobalErrorHandler,
    public dialog: MatDialog,
    private faucetService: FaucetService) {

    this.errorOccuredSubscription = this.errorHandler
      .getMessage()
      .subscribe(error => this.loadErrorDialog(error));
  }

  ngOnDestroy() {
    this.errorOccuredSubscription.unsubscribe();
  }

  private loadErrorDialog(error: any) {
    this.dialog.open(ErrorDialogComponent, { data: error });
  }

  onGetTokensButtonClick() {
    if (!this.chainiumAddress) {
      return;
    }

    this.faucetService.claimChx(this.chainiumAddress).subscribe(info => {
      if (!info || info.errors) {
        this.chainiumAddress = null;
        this.messages = info.errors;
        return;
      }
      this.messages = [info as string];

    });
  }

  onGetAssetsButtonClick() {
    if (!this.addressHash) {
      return;
    }

    this.faucetService.claimAsset(this.addressHash).
      subscribe(info => {
      if (!info || info.errors) {
        this.addressHash = null;
        this.messages = info.errors;
        return;
      }
      this.messages = [info as string];

    });
  }
}
