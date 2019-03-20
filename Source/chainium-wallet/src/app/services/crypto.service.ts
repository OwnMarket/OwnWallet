import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { WalletInfo } from '../models/WalletInfo';
import { Tx, TxEnvelope } from '../models/SubmitTransactions';

declare var chainiumSdk: any;

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  public generateWallet(): Observable<WalletInfo> {
    const wallet = chainiumSdk.crypto.generateWallet();
    return of(wallet);
  }

  public getAddressFromKey(privateKey: string): Observable<any> {
    const address = chainiumSdk.crypto.addressFromPrivateKey(privateKey);
    return of(address);
  }

  public signTransaction(privateKey: string, tx: Tx): Observable<TxEnvelope> {
    const rawTx = chainiumSdk.crypto.utf8ToHex(JSON.stringify(tx));
    const signature = chainiumSdk.crypto.signMessage(environment.networkCode,privateKey, rawTx);
    return of({
      tx: chainiumSdk.crypto.encode64(rawTx),
      signature: signature
    });
  }

  public deriveHash(address: string, nonce: number, txActionNumber: number): string {
    return chainiumSdk.crypto.deriveHash(address, nonce, txActionNumber);
  }
}
