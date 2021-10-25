import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AccountInfo } from '../models/account-info.model';
import { TxEnvelope } from '../models/submit-transactions.model';
import { ChxAddressInfo } from '../models/chx-address-info.model';
import { map } from 'rxjs/operators';

const TXENDPOINT = 'tx';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private baseServiceUrl: string;
  private httpHandler: HttpClient;

  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.baseServiceUrl = environment.nodeApiUrl;
    this.httpHandler = new HttpClient(handler);
  }

  public getAddressInfo(chxAddress: string): Observable<ChxAddressInfo> {
    const addresInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}`;
    return this.httpHandler.get<any>(addresInfoUrl);
  }

  public getAccountInfo(accountHash: string): Observable<any> {
    const accountInfoUrl = `${this.baseServiceUrl}/account/${accountHash}`;
    return this.http.get<AccountInfo>(accountInfoUrl);
  }

  public getAssetInfo(assetHash: string): Observable<any> {
    const assetInfoUrl = `${this.baseServiceUrl}/asset/${assetHash}`;
    return this.http.get<AccountInfo>(assetInfoUrl);
  }

  public getMinFee(): number {
    return 0.1;
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

  public getLatestBlockNumber(): Observable<any> {
    const latestBlockNumberUrl = `${this.baseServiceUrl}/block/head/number`;
    return this.http.get<any>(latestBlockNumberUrl);
  }

  public getChxAddressAccounts(chxAddress: string): Observable<any> {
    const addressAccountsInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}/accounts`;
    return this.http.get<any>(addressAccountsInfoUrl);
  }

  public getChxAddressAssets(chxAddress: string): Observable<any> {
    const addressAssetsInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}/assets`;
    return this.http.get<any>(addressAssetsInfoUrl);
  }

  public getChxAddressStakes(chxAddress: string): Observable<any> {
    const stakesInfoUrl = `${this.baseServiceUrl}/address/${chxAddress}/stakes`;
    return this.http.get<any>(stakesInfoUrl);
  }

  public getValidatorInfo(validatorHash: string): Observable<any> {
    const validatorInfoUrl = `${this.baseServiceUrl}/validator/${validatorHash}`;
    return this.http.get<any>(validatorInfoUrl);
  }

  public getValidators(activeOnly: boolean): Observable<any> {
    const validatorsUrl = `${this.baseServiceUrl}/validators?activeOnly=${activeOnly}`;
    return this.http.get<any>(validatorsUrl);
  }

  public getValidatorStakes(validatorHash: string): Observable<any> {
    const stakesInfoUrl = `${this.baseServiceUrl}/validator/${validatorHash}/stakes`;
    return this.http.get<any>(stakesInfoUrl);
  }

  public getequivocationProofInfo(equivocationProofHash: string): Observable<any> {
    const equivocationProofInfoUrl = `${this.baseServiceUrl}/equivocation/${equivocationProofHash}`;
    return this.http.get<any>(equivocationProofInfoUrl);
  }
}
