import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WalletRoutes } from './services/walletroutes.service';
import { WalletRouteInfo } from './models/WalletRouteInfo';
import { PrivatekeyService } from './services/privatekey.service';
import { MatDialog } from '@angular/material';
import { GlobalErrorHandler } from './services/global.error.handler'
import { ErrorDialogComponent } from './error-dialog/error-dialog.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {
  title = 'app';

  routes: WalletRouteInfo[];
  displayBalanceInfo: boolean;
  balanceChangeSubscription: Subscription;
  errorOccuredSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private routeService: WalletRoutes,
    private privateKeyService: PrivatekeyService,
    private errorHandler: GlobalErrorHandler,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog) {
    this.routes = this.routeService.getRoutes();

    this.balanceChangeSubscription = this.privateKeyService
      .getMessage()
      .subscribe(message => this.displayBalanceInfo = message);

    this.errorOccuredSubscription = this.errorHandler
      .getMessage()
      .subscribe(error => this.loadErrorDialog(error));
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.balanceChangeSubscription.unsubscribe();
    this.errorOccuredSubscription.unsubscribe();
  }

  private loadErrorDialog(error : any){
    this.dialog.open(ErrorDialogComponent, { data: error });
  }
}
