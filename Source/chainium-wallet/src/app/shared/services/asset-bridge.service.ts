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

  async getNativeTransferFee(): Promise<number> {
    try {
      return (await this.assetBridge.methods.nativeTransferFee().call()) / Math.pow(10, 18);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async ethTransferFee(): Promise<number> {
    try {
      return (await this.assetBridge.methods.ethTransferFee().call()) / Math.pow(10, 18);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async tokenDecimals(): Promise<number> {
    try {
      return await this.token.methods.decimals().call();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async accountsForAssets(assetHash: string): Promise<string> {
    try {
      return await this.assetBridge.methods.accountsForAssets(assetHash).call();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async balanceOf(address: string): Promise<number> {
    try {
      const decimals = await this.tokenDecimals();
      return (await this.token.methods.balanceOf(address).call()) / Math.pow(10, decimals);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async transferToNativeChain(
    address: string,
    tokenAddress: string,
    accountHash: string,
    amount: number
  ): Promise<any> {
    try {
      const decimals = await this.tokenDecimals();
      const totalAmount = amount * Math.pow(10, decimals);
      const fee = await this.getNativeTransferFee();
      return await this.assetBridge.methods
        .transferToNativeChain(totalAmount, tokenAddress, accountHash, fee)
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
      this.statusSubj.next('ready');
      throw new Error(error.message);
    }
  }

  async transferFromNativeChain(
    assetHash: string,
    address: string,
    fromAccountHash: string,
    chxAddress: string,
    nonce: number,
    ownFee: number,
    privateKey: string
  ): Promise<any> {
    try {
      const toAccountHash = await this.accountsForAssets(assetHash);
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
      this.statusSubj.next('ready');
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

  resetStatus() {
    this.statusSubj.next('ready');
    this.txResultSubj.next(null);
  }
}
