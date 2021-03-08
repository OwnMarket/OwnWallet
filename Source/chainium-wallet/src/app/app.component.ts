import { LoaderService } from './shared/services/loader.service';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LoaderMessage } from './shared/models/loader-message.enum';
import { GlobalErrorHandler } from './shared/services/global.error.handler';
import { WalletHttpInterceptor } from './shared/services/wallet-http-interceptor';
import { WalletService } from './shared/services/wallet.service';
import { Router } from '@angular/router';

const LoaderDlg = 'LoaderDlg';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoading: Observable<boolean> = this.loaderService.isLoading;
  private prevMessage: LoaderMessage;

  constructor(
    private router: Router,
    private errorHandler: GlobalErrorHandler,
    private interceptor: WalletHttpInterceptor,
    private ownModalService: OwnModalService,
    private walletService: WalletService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    window.onload = function () {
      sessionStorage.clear();
    };
    this.errorHandler.getMessage().subscribe((error) => this.loadErrorDialog(error));
    this.interceptor.getMessage().subscribe((msg) => this.progressBarAction(msg));
  }

  closeModal(id: string) {
    this.ownModalService.close(id);
  }

  onUnloadWallet(id: string) {
    this.walletService.unloadWallet();
    this.ownModalService.close(id);
    this.router.navigate(['/wallet']);
    sessionStorage.clear();
    location.reload();
  }

  private loadErrorDialog(error: any) {
    let errors = [];
    if (error.message) {
      try {
        let jsonStart = error.message.indexOf('{');
        let parsedMessage = JSON.parse(error.message.slice(jsonStart));
        errors.push(parsedMessage);
      } catch (e) {
        return;
      }
    } else {
      errors.push(error);
    }

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
