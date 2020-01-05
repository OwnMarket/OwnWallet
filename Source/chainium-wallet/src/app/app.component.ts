import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoaderMessage } from './models/loader-message.enum';
import { GlobalErrorHandler } from './services/global.error.handler';
import { WalletHttpInterceptor } from './services/wallet-http-interceptor';
import { LoaderComponent } from './loader/loader.component';

const LoaderDlg = 'LoaderDlg';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    private loaderef: MatDialogRef<LoaderComponent>;
    private prevMessage: LoaderMessage;

    title = 'app';

    errorOccuredSubscription: Subscription;
    openLoadingDialogSubscription: Subscription;

    constructor(
        private errorHandler: GlobalErrorHandler,
        private interceptor: WalletHttpInterceptor,
        public dialog: MatDialog,
        private ownModalService: OwnModalService
        ) {}

    ngOnInit() {
      this.errorOccuredSubscription = this.errorHandler
      .getMessage()
      .subscribe(error => this.loadErrorDialog(error));

    this.openLoadingDialogSubscription = this.interceptor
        .getMessage()
        .subscribe(msg => this.progressBarAction(msg));
    }

    private loadErrorDialog(error: any) {
        const errors = [error];
        this.ownModalService.errors(errors);
        this.ownModalService.open('error-dialog');
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
