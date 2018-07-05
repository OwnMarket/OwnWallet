import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WalletInfo } from '../models/WalletInfo';


@Injectable({
  providedIn: 'root'
})
export class PrivatekeyService {

  constructor() { }

  walletInfo : WalletInfo;

  existsKey():boolean{
    if (this.walletInfo && this.walletInfo.privateKey) {
      return true;
    }
    
    return false;
  }

  private subject = new Subject<any>();
 
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
