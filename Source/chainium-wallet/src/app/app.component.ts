import { LoaderService } from './shared/services/loader.service';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LoaderMessage } from './shared/models/loader-message.enum';
import { GlobalErrorHandler } from './shared/services/global.error.handler';
import { WalletHttpInterceptor } from './shared/services/wallet-http-interceptor';

const LoaderDlg = 'LoaderDlg';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    isLoading: Observable<boolean> = this.loaderService.isLoading;
    private prevMessage: LoaderMessage;

    constructor(
        private errorHandler: GlobalErrorHandler,
        private interceptor: WalletHttpInterceptor,
        private ownModalService: OwnModalService,
        private loaderService: LoaderService
        ) {}

    ngOnInit() {

     this.errorHandler
      .getMessage()
      .subscribe(error => this.loadErrorDialog(error));

    this.interceptor
        .getMessage()
        .subscribe(msg => this.progressBarAction(msg));
    }

    private loadErrorDialog(error: any) {
        const errors = [error];
        this.ownModalService.errors(errors);
        this.ownModalService.open('error-dialog');
    }

    private progressBarAction(message: LoaderMessage) {
        if (this.prevMessage === message) {
            return;
        }

        if (message === LoaderMessage.Start) {
            setTimeout(() => this.loaderService.show());
        }

        if (message === LoaderMessage.End) {
            setTimeout(() => this.loaderService.hide(), 500);
        }

        this.prevMessage = message;
    }
}
