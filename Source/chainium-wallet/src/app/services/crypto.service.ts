import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { WalletInfo } from '../models/WalletInfo';
import { Tx, TxEnvelope } from '../models/SubmitTransactions';

const GENERATEWALLET = 'wallet';
const GETADDRESS = 'address';
const SIGNTRANSACTION = 'sign';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private baseServiceUrl: string;
  constructor(private http: HttpClient) {
    this.baseServiceUrl = environment.walletApiUrl;
  }

  public generateWallet(): Observable<WalletInfo> {
    const walleturl = `${this.baseServiceUrl}/${GENERATEWALLET}`;
    return this.http.get<WalletInfo>(walleturl);
  }

  public getAddressFromKey(privateKey: string): Observable<any> {
    const getAddressUrl = `${this.baseServiceUrl}/${GETADDRESS}`;
    const data = { privateKey : privateKey };
    return this.http.post<any>(getAddressUrl, data);
  }
  public signTransaction(privateKey: string, tx: Tx): Observable<TxEnvelope> {
    const txTxt = JSON.stringify(tx);

    const signRequest = {
      privateKey : privateKey,
      dataToSign : txTxt
    };

    const signMessageUrl = `${this.baseServiceUrl}/${SIGNTRANSACTION}`;

    return this.http.post<TxEnvelope>(signMessageUrl, signRequest);
  }
}
