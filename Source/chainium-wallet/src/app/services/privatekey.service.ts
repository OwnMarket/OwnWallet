import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WalletInfo } from '../models/wallet-info.model';


@Injectable({
    providedIn: 'root'
})
export class PrivatekeyService {

    constructor() { }

    private walletInfo: WalletInfo;
    private subject = new Subject<any>();

    existsKey(): boolean {
        if (this.walletInfo && this.walletInfo.privateKey)
            return true;    

        return false;
    }

    getWalletInfo() {
        return this.walletInfo;
    }

    setWalletInfo(walletInfo: WalletInfo) {
        this.walletInfo = walletInfo;
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
