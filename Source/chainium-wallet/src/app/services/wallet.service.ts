import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WalletInfo } from '../models/wallet-info.model';


@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

  wallets: WalletInfo[] = [];

  private subject = new Subject<any>();

  existsWallet(): boolean {
    if (this.wallets && this.wallets.length > 0) {
      return true;
    }

    return false;
  }


  sendMessage(message: boolean) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
