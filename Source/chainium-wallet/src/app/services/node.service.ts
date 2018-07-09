import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ChxAddressInfo } from '../models/ChxAddressInfo';
import { AccountInfo, Holding } from '../models/AccountInfo';
import { TxEnvelope, TxResult } from '../models/SubmitTransactions';
import { TransactionInfo } from '../models/TransactionInfo';
import { BlockInfo } from '../models/BlockInfo';




const TXENDPOINT = 'tx';


@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private baseServiceUrl: string;

  constructor(private http: HttpClient) {
    this.baseServiceUrl = environment.nodeApiUrl;
  }

  public getAddressInfo(chxAddress: string): Observable<any> {
    const addresInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}`;
    return this.http.get<any>(addresInfoUrl);
  }

  public getAccountInfo(accountHash: string): Observable<any> {
    const accountInfoUrl = `${this.baseServiceUrl}/account/${accountHash}`;
    return this.http.get<AccountInfo>(accountInfoUrl);
  }

  public getMinFee(): number {
    // TODO: decide on how to get this value
    // for now return 0.1
    return 0.01;
  }

  public submitTransaction(txEnvelope: TxEnvelope): Observable<any> {
    const submitTxUrl = `${this.baseServiceUrl}/${TXENDPOINT}`;
    return this.http.post<any>(submitTxUrl, txEnvelope);
  }

  public getTransactionInfo(txHash: string): Observable<any> {
    const transactionInfoUrl = `${this.baseServiceUrl}/${TXENDPOINT}/${txHash}`;
    return this.http.get<any>(transactionInfoUrl);
  }

  public getBlockInfo(blockNumber: number): Observable<any> {
    const blockInfoUrl = `${this.baseServiceUrl}/block/${blockNumber}`;
    return this.http.get<any>(blockInfoUrl);
  }

  public getChxAddressAccounts(chxAddress: string): Observable<any> {
    const adressesInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}/accounts`;
    return this.http.get<any>(adressesInfoUrl);
  }
}
