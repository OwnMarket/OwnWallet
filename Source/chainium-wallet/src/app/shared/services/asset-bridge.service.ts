import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service';
import { PrivatekeyService } from './privatekey.service';
import { NodeService } from './node.service';
import { ApiResponse, BridgeAsset, TxResult } from '../models';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';

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

  constructor(
    private handler: HttpBackend,
    private config: ConfigurationService,
    private privateKeyService: PrivatekeyService,
    private nodeService: NodeService
  ) {
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

  async getNativeBalance(accountHash: string, assetHash: string): Promise<number> {
    try {
      return await this.getAssetBalance(accountHash, assetHash).toPromise();
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

  shortHashFromLong(hash: string): string {
    const orig = ownBlockchainSdk.crypto.decode64(hash);
    return ownBlockchainSdk.crypto.hash(orig);
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
    amount: number
  ): Promise<any> {
    try {
      const privateKey = this.privateKeyService.getWalletInfo().privateKey;
      const fee = this.nodeService.getMinFee();
      const nonce = await this.nodeService
        .getAddressInfo(chxAddress)
        .pipe(map((resp) => resp.nonce + 1))
        .toPromise();
      const toAccountHash = await this.accountsForAssets(assetHash);
      const txToSign = ownBlockchainSdk.transactions.createTx(chxAddress, nonce, fee);
      txToSign.addTransferAssetAction(fromAccountHash, toAccountHash, assetHash, amount);
      const signature = txToSign.sign(environment.networkCode, privateKey);
      const ownTxHash = this.shortHashFromLong(signature.tx);
      const ethFee = await this.ethTransferFee();

      return await this.assetBridge.methods
        .transferFromNativeChain(ethFee, ownTxHash, signature, address)
        .send({
          from: address,
        })
        .on('transactionHash', (hash: string) => {
          let txResult = new TxResult();
          txResult.txHash = hash;
          this.txResultSubj.next(txResult);
          this.statusSubj.next('proccessing');
        })
        .on('receipt', async (receipt) => {
          console.log(receipt);
          const tx = await this.nodeService.submitTransaction(signature).toPromise();
          if (tx.errors) {
            throw new Error(tx.errors);
          }
          const txResult = tx as TxResult;
          this.txResultSubj.next(txResult);
          this.statusSubj.next('done');
        });
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

  public getAssetBalance(accountHash: string, assetHash: string): Observable<number> {
    const accountInfoUrl = `${environment.nodeApiUrl}/account/${accountHash}?asset=${assetHash}`;
    return this.httpHandler.get<any>(accountInfoUrl).pipe(
      map((resp) => {
        if (resp.holdings && resp.holdings.length > 0) {
          return resp.holdings[0].balance;
        }
        return 0;
      })
    );
  }

  resetStatus() {
    this.statusSubj.next('ready');
    this.txResultSubj.next(null);
  }
}
