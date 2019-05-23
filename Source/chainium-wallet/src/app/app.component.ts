import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoaderMessage } from './models/loader-message.enum';
import { GlobalErrorHandler } from './services/global.error.handler';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { WalletHttpInterceptor } from './services/wallet-http-interceptor';
import { LoaderComponent } from './loader/loader.component';

const LoaderDlg = 'LoaderDlg';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

    private loaderef: MatDialogRef<LoaderComponent>;
    private prevMessage: LoaderMessage;

    title = 'app';

    errorOccuredSubscription: Subscription;
    openLoadingDialogSubscription: Subscription;

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    constructor(
        private errorHandler: GlobalErrorHandler,
        private breakpointObserver: BreakpointObserver,
        private interceptor: WalletHttpInterceptor,
        public dialog: MatDialog) {

        this.errorOccuredSubscription = this.errorHandler
            .getMessage()
            .subscribe(error => this.loadErrorDialog(error));

        this.openLoadingDialogSubscription = this.interceptor
            .getMessage()
            .subscribe(msg => this.progressBarAction(msg));
    }
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.errorOccuredSubscription.unsubscribe();
        this.openLoadingDialogSubscription.unsubscribe();
    }

    private loadErrorDialog(error: any) {
        this.dialog.open(ErrorDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: error
        });
    }

    private newLoaderDialog() {
        this.loaderef = this.dialog.getDialogById(LoaderDlg);
        if (!this.loaderef) {
            this.loaderef = this.dialog.open(LoaderComponent, {
                disableClose: true,
                id: LoaderDlg
            });     
        }
    }

    private progressBarAction(message: LoaderMessage) {
        if (this.prevMessage === message) {
            return;
        }

        if (message === LoaderMessage.Start) {                       
            setTimeout(() => this.newLoaderDialog());
        }

        if (this.loaderef && message === LoaderMessage.End) {
            setTimeout(() => this.loaderef.close());
        }

        this.prevMessage = message;
    }
}
