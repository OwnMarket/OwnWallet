import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { WalletInfo } from '../models/WalletInfo';
import { Tx, TxEnvelope } from '../models/SubmitTransactions';

const WALLETAPIURL: string = "http://localhost:5162";
const GENERATEWALLET: string = "wallet";
const GETADDRESS : string = "address";
const SIGNTRANSACTION : string = "sign";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private baseServiceUrl : string = WALLETAPIURL;
  constructor(private http: HttpClient) { }

  public generateWallet(): Observable<WalletInfo> {
    let walleturl = `${this.baseServiceUrl}/${GENERATEWALLET}`;
    return this.http.get<WalletInfo>(walleturl);
  }

  public getAddressFromKey(privateKey: string): Observable<any> {
    let getAddressUrl = `${this.baseServiceUrl}/${GETADDRESS}`;
    let data = { privateKey : privateKey };
    return this.http.post<any>(getAddressUrl, data);
  }
  public signTransaction(privateKey: string, tx: Tx): Observable<TxEnvelope> { 
    let txTxt = JSON.stringify(tx);

    let signRequest = {
      privateKey : privateKey,
      dataToSign : txTxt
    };

    let signMessageUrl = `${this.baseServiceUrl}/${SIGNTRANSACTION}`

    return this.http.post<TxEnvelope>(signMessageUrl,signRequest);
  }
}
