import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ChxAddressInfo } from '../models/ChxAddressInfo';
import { AccountInfo, Holding } from '../models/AccountInfo';
import { TxEnvelope, TxResult } from '../models/SubmitTransactions';
import { TransactionInfo } from '../models/TransactionInfo';
import { BlockInfo } from '../models/BlockInfo';



const NODEAPI = "http://localhost:10717";
const TXENDPOINT = "tx";


@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private baseServiceUrl: string = NODEAPI;

  constructor(private http: HttpClient) { }

  public getAddressInfo(chxAddress: string): Observable<any> {
    let addresInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}`;
    return this.http.get<any>(addresInfoUrl);
  }

  public getAccountInfo(accountHash: string): Observable<any> {
    let accountInfoUrl = `${this.baseServiceUrl}/account/${accountHash}`;
    return this.http.get<AccountInfo>(accountInfoUrl);
  }

  public getMinFee(): number {
    //TODO: decide on how to get this value
    //for now return 0.1
    return 0.1;
  }

  public submitTransaction(txEnvelope: TxEnvelope): Observable<any> {
    let submitTxUrl = `${this.baseServiceUrl}/${TXENDPOINT}`;
    return this.http.post<any>(submitTxUrl, txEnvelope);
  }

  public getTransactionInfo(txHash: string): Observable<any> {
    let transactionInfoUrl = `${this.baseServiceUrl}/${TXENDPOINT}/${txHash}`;
    return this.http.get<any>(transactionInfoUrl);
  }

  public getBlockInfo(blockNumber: number): Observable<any> {
    let blockInfoUrl = `${this.baseServiceUrl}/block/${blockNumber}`;
    return this.http.get<any>(blockInfoUrl);
  }
}
