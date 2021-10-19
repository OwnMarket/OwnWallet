import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Web3 from 'web3';
import { ConfigurationService } from './configuration.service';
import { ChxBridgeFeeService } from './chx-bridge-fee.service';
import { CryptoService } from './crypto.service';
import { BridgeAsset, BridgeFee, TxResult } from '../models';

@Injectable({ providedIn: 'root' })
export class ChxBridgeService {
  private chx: BridgeAsset;
  private token: any;
  private mapping: any;
  private blockchain: string;

  private statusSubj: BehaviorSubject<string> = new BehaviorSubject<string>('ready');
  private errorSubj: BehaviorSubject<string> = new BehaviorSubject<string | null>(null);
  private txResultSubj: BehaviorSubject<TxResult> = new BehaviorSubject<TxResult>(null);
  status$: Observable<string> = this.statusSubj.asObservable();
  error$: Observable<string> = this.errorSubj.asObservable();
  txResult$: Observable<TxResult> = this.txResultSubj.asObservable();

  constructor(
    private config: ConfigurationService,
    private bridgeFeeService: ChxBridgeFeeService,
    private cryptoService: CryptoService
  ) {
    this.initAsset();
  }

  initAsset() {
    this.chx = {
      assetCode: 'CHX',
      bridgedTokens: [
        {
          targetBlockchain: 0,
          tokenAddress: this.config.config['eth'].tokenContract,
          ownerChxAddress: this.config.config['eth'].ownerChxAddress,
          mappingContract: this.config.config['eth'].mappingContract,
        },
        {
          targetBlockchain: 1,
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
          throw new Error(
            `Currently selected ${this.network} Address has been already mapped to other CHX Address, please select other account in your MetaMask and try again.`
          );
        }
        return true;
      }
      return true;
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
      return error;
    }
  }

  getBridgeFee(targetAddress: string, sourceBlockchain: string, targetBlockchain: string): Observable<BridgeFee> {
    const type = sourceBlockchain === 'own' ? 'wrap' : 'unwrap';
    return this.bridgeFeeService.getBridgeFees(targetBlockchain, targetAddress, type).pipe(map((resp) => resp.data));
  }

  mapAddress(targetAddress: string, chxAddress: string, privateKey: string): Observable<any> {
    this.statusSubj.next('loading');
    return this.cryptoService.signMessage(privateKey, targetAddress).pipe(
      map(async (signature: string) => {
        try {
          await this.mapping.methods
            .mapAddress(chxAddress, signature)
            .send({
              from: targetAddress,
            })
            .on('transactionHash', (hash: string) => {
              let txResult = new TxResult();
              txResult.txHash = hash;
              this.txResultSubj.next(txResult);
              this.statusSubj.next('inprogress');
            })
            .on('receipt', (receipt) => {
              this.txResultSubj.next(null);
              this.statusSubj.next('done');
            });

          return true;
        } catch (error) {
          this.errorSubj.next(error.error.message);
          return false;
        }
      })
    );
  }
}
