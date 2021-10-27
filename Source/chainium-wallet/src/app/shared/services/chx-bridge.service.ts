import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Web3 from 'web3';
import { ConfigurationService } from './configuration.service';
import { ChxBridgeFeeService } from './chx-bridge-fee.service';
import { NodeService } from './node.service';
import { CryptoService } from './crypto.service';
import { BridgeAsset, BridgeFee, TxResult } from '../models';
import { environment } from 'src/environments/environment';

declare var ownBlockchainSdk: any;

@Injectable({ providedIn: 'root' })
export class ChxBridgeService {
  private chx: BridgeAsset;
  private token: any;
  private mapping: any;
  private blockchain: string;

  private statusSubj: BehaviorSubject<string> = new BehaviorSubject<string>('ready');
  private errorSubj: BehaviorSubject<string> = new BehaviorSubject<string | null>(null);
  private txResultSubj: BehaviorSubject<TxResult> = new BehaviorSubject<TxResult>(new TxResult());
  status$: Observable<string> = this.statusSubj.asObservable();
  error$: Observable<string> = this.errorSubj.asObservable();
  txResult$: Observable<TxResult> = this.txResultSubj.asObservable();

  constructor(
    private config: ConfigurationService,
    private bridgeFeeService: ChxBridgeFeeService,
    private cryptoService: CryptoService,
    private nodeService: NodeService
  ) {
    this.initAsset();
  }

  initAsset() {
    this.chx = {
      assetCode: 'CHX',
      bridgedTokens: [
        {
          targetBlockchain: 'Eth',
          tokenAddress: this.config.config['eth'].tokenContract,
          ownerChxAddress: this.config.config['eth'].ownerChxAddress,
          mappingContract: this.config.config['eth'].mappingContract,
        },
        {
          targetBlockchain: 'Bsc',
          tokenAddress: this.config.config['bsc'].tokenContract,
          ownerChxAddress: this.config.config['bsc'].ownerChxAddress,
          mappingContract: this.config.config['bsc'].mappingContract,
        },
      ],
    };
  }

  initContracts(web3: Web3, blockchain: string) {
    this.blockchain = blockchain;
    this.mapping = new web3.eth.Contract(
      this.config.config[blockchain].mappingABI,
      this.config.config[blockchain].mappingContract
    );

    this.token = new web3.eth.Contract(
      this.config.config[blockchain].tokenABI,
      this.config.config[blockchain].tokenContract
    );
  }

  get ChxAsset(): BridgeAsset {
    return this.chx;
  }

  get network(): string {
    return this.config.config[this.blockchain].network;
  }

  get explorer(): string {
    return this.config.config[this.blockchain].explorerUrl;
  }

  async addressIsMapped(chxAddress: string, blockchain: string): Promise<boolean> {
    try {
      const targetAddress = await this.mapping.methods[blockchain + 'Address'](chxAddress).call();
      if (targetAddress !== '0x0000000000000000000000000000000000000000' && targetAddress !== '') {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(
        `Please check if your currently selected network in MetaMask is ${this.network}. Change currently selected network in MetaMask to ${this.network} and try again.`
      );
    }
  }

  async addressIsMappedToOtherChxAddress(address: string, chxAddress: string): Promise<boolean> {
    try {
      const chxAddr = await this.mapping.methods.chxAddress(address).call();

      if (chxAddr !== '') {
        if (chxAddr !== chxAddress) {
          return true;
        }
        return false;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async balanceAndMinAmount(address: string): Promise<any> {
    try {
      const balance = (await this.token.methods.balanceOf(address).call()) / Math.pow(10, 7);
      const minWrapAmount = (await this.token.methods.minWrapAmount().call()) / Math.pow(10, 7);
      return { balance, minWrapAmount };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getBridgeFee(targetAddress: string, sourceBlockchain: string, targetBlockchain: string): Observable<BridgeFee> {
    const type = sourceBlockchain === 'own' ? 'wrap' : 'unwrap';
    return this.bridgeFeeService.getBridgeFees(targetBlockchain, targetAddress, type).pipe(map((resp) => resp.data));
  }

  async mapAddress(targetAddress: string, chxAddress: string, privateKey: string): Promise<any> {
    try {
      this.statusSubj.next('mapping');
      const signature = await this.cryptoService.signMessageAsPromise(privateKey, targetAddress);
      await this.mapping.methods
        .mapAddress(chxAddress, signature)
        .send({
          from: targetAddress,
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

  async transferChxFromWeOwn(
    chxAddress: string,
    nonce: number,
    fee: number,
    amount: number,
    privateKey: string
  ): Promise<any> {
    try {
      const txToSign = ownBlockchainSdk.transactions.createTx(chxAddress, nonce, fee);
      txToSign.addTransferChxAction(this.config.config[this.blockchain].ownerChxAddress, amount);
      const signature = txToSign.sign(environment.networkCode, privateKey);

      const result = await this.nodeService.submitTransaction(signature).toPromise();

      if (result.errors) {
        throw new Error(result.errors);
      }

      this.txResultSubj.next(result as TxResult);
      this.statusSubj.next('done');
    } catch (error) {
      this.statusSubj.next('ready');
      throw new Error(error.message);
    }
  }

  async transferToWeOwn(amount: number, address: string): Promise<any> {
    try {
      this.statusSubj.next('preparing');
      await this.token.methods
        .transfer(this.config.config[this.blockchain].tokenContract, amount)
        .send({
          from: address,
        })
        .on('transactionHash', (hash) => {
          let txResult = new TxResult();
          txResult.txHash = hash;
          this.txResultSubj.next(txResult);
          this.statusSubj.next('proccessing');
        })
        .on('receipt', (receipt) => {
          this.statusSubj.next('done');
        })
        .on('error', (error, receipt) => {
          this.statusSubj.next('ready');
          switch (error.code) {
            case 4001:
              throw new Error(
                'The transaction was rejected in MetaMask. The process was therefore cancelled and no tokens are transferred.'
              );
            case -32602:
              throw new Error(`Check if your currently selected address in MetaMask is ${address} and try again.`);
            default:
              throw new Error(error.message);
          }
        });
    } catch (error) {
      this.statusSubj.next('ready');
      throw new Error(error.message);
    }
  }

  resetStatus() {
    this.statusSubj.next('ready');
    this.txResultSubj.next(null);
  }
}
