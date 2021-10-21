import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service';
import { ApiResponse, BridgeAsset, TxResult } from '../models';
import Web3 from 'web3';

declare var ownBlockchainSdk: any;

@Injectable({ providedIn: 'root' })
export class AssetBridgeService {
  private httpHandler: HttpClient;
  private blockchain: string;
  private token: any;
  private assetBridge: any;

  private statusSubj: BehaviorSubject<string> = new BehaviorSubject<string>('ready');
  private errorSubj: BehaviorSubject<string> = new BehaviorSubject<string | null>(null);
  private txResultSubj: BehaviorSubject<TxResult> = new BehaviorSubject<TxResult>(null);
  status$: Observable<string> = this.statusSubj.asObservable();
  error$: Observable<string> = this.errorSubj.asObservable();
  txResult$: Observable<TxResult> = this.txResultSubj.asObservable();

  constructor(private handler: HttpBackend, private config: ConfigurationService) {
    this.httpHandler = new HttpClient(handler);
  }

  async initContracts(web3: Web3, blockchain: string, tokenAddress: string): Promise<any> {
    this.blockchain = blockchain;
    try {
      const assetBridgeContract = this.config.config.assetBridgeContract;
      const assetBridgeAbi = await this.getABI(blockchain, assetBridgeContract).toPromise();
      const tokenAbi = await this.getABI(blockchain, tokenAddress).toPromise();
      this.assetBridge = new web3.eth.Contract(assetBridgeAbi, assetBridgeContract);
      this.token = new web3.eth.Contract(tokenAbi, tokenAddress);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNativeTransferFee(): Promise<any> {
    try {
      return (await this.assetBridge.methods.nativeTransferFee().call()) / Math.pow(10, 18);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async ethTransferFee(): Promise<any> {
    try {
      return (await this.assetBridge.methods.ethTransferFee().call()) / Math.pow(10, 18);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async tokenDecimals(): Promise<any> {
    try {
      return await this.token.methods.decimals().call();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async transferToNativeChain(
    address: string,
    tokenAddress: string,
    accountHash: string,
    amount: number,
    nativeTransferFee: number
  ): Promise<any> {
    try {
      const decimals = await this.tokenDecimals();
      const totalAmount = amount * Math.pow(10, decimals);
      return await this.assetBridge.methods
        .transferToNativeChain(totalAmount, tokenAddress, accountHash, nativeTransferFee)
        .send({
          from: address,
        })
        .on('transactionHash', (hash: string) => {
          let txResult = new TxResult();
          txResult.txHash = hash;
          this.txResultSubj.next(txResult);
          this.statusSubj.next('proccessing');
        })
        .on('receipt', (receipt) => {
          this.statusSubj.next('done');
        });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async transferFromNativeChain(
    address: string,
    fromAccountHash: string,
    toAccountHash: string,
    chxAddress: string,
    nonce: number,
    ownFee: number,
    privateKey: string
  ): Promise<any> {
    try {
      const txToSign = ownBlockchainSdk.transactions.createTx(chxAddress, nonce, ownFee);

      // return await this.assetBridge.methods
      //   .transferFromNativeChain(ethTransferFee, txHash, signature, address)
      //   .send({
      //     from: address,
      //   })
      //   .on('transactionHash', (hash: string) => {
      //     let txResult = new TxResult();
      //     txResult.txHash = hash;
      //     this.txResultSubj.next(txResult);
      //     this.statusSubj.next('proccessing');
      //   })
      //   .on('receipt', (receipt) => {
      //     this.statusSubj.next('done');
      //   });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getAssets(): Observable<ApiResponse<BridgeAsset[]>> {
    return this.httpHandler.get<ApiResponse<BridgeAsset[]>>(`${this.config.config.bridgeApiUrl}/assets`);
  }

  getABI(targetBlockchain: string, tokenAddress: string): Observable<any> {
    return this.httpHandler
      .get<ApiResponse<any>>(`${this.config.config.bridgeApiUrl}/assets/${targetBlockchain}/${tokenAddress}/abi`)
      .pipe(map((resp) => JSON.parse(resp.data)));
  }
}
