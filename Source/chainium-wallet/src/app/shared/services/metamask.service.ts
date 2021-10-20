import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskStatus } from '../enums/metamask-status.enum';
import { ConfigurationService } from './configuration.service';

@Injectable({ providedIn: 'root' })
export class MetamaskService {
  public web3: Web3;
  public provider: any;
  public currentAccount: string;

  networks = {
    '0x1': 'Ethereum Main Network',
    '0x3': 'Ropsten Test Network',
    '0x4': 'Rinkeby Test Network',
    '0x5': 'Goerli Test Network',
    '0x2a': 'Kovan Test Network',
    '0x38': 'Smart Chain',
    '0x61': 'Smart Chain - Testnet',
  };

  private errorSubj: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private statusSubj: BehaviorSubject<MetaMaskStatus> = new BehaviorSubject<MetaMaskStatus>(
    MetaMaskStatus.Disconnected
  );
  private chainIdSubj: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private accountSubj: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  error$: Observable<string | null> = this.errorSubj.asObservable();
  status$: Observable<MetaMaskStatus> = this.statusSubj.asObservable();
  chainId$: Observable<string | null> = this.chainIdSubj.asObservable();
  account$: Observable<string | null> = this.accountSubj.asObservable();

  constructor(private configService: ConfigurationService) {
    this.provider = window.ethereum as any;
    if (this.provider && this.provider.isMetaMask && this.provider.selectedAddress) {
      console.log('MetaMaskService: MetaMask installed');
      this.init();
    }
  }

  async init() {
    console.log('Init metamask');
    this.statusSubj.next(MetaMaskStatus.Initiating);
    this.web3 = new Web3(Web3.givenProvider);
    this.provider = await detectEthereumProvider();
    this.web3.setProvider(this.provider);
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    this.chainIdSubj.next(chainId);

    this.provider.on('disconnect', () => {
      this.statusSubj.next(MetaMaskStatus.Disconnected);
    });

    this.provider.on('chainChanged', (chainId: string) => {
      console.log('changed network', chainId);
      this.chainIdSubj.next(chainId);
    });

    this.provider.on('accountsChanged', async (accounts: string[]) => await this.syncAccounts(accounts));

    await this.connect();
  }

  async connect() {
    console.log('Connect metamask');
    try {
      this.statusSubj.next(MetaMaskStatus.Connecting);
      const accounts: string[] = await this.provider.request({ method: 'eth_requestAccounts' });
      await this.syncAccounts(accounts);
    } catch (error: any) {
      this.statusSubj.next(MetaMaskStatus.Disconnected);
      console.log(error);
      this.errorSubj.next(error);
    }
  }

  async syncAccounts(accounts: string[]) {
    console.log('sync');
    this.statusSubj.next(MetaMaskStatus.Connected);
    if (accounts.length === 0) {
      this.errorSubj.next(`Your MetaMask wallet is locked or you didn't connect any accounts.`);
    }
    if (accounts[0] !== this.currentAccount) {
      this.accountSubj.next(accounts[0]);
      this.currentAccount = accounts[0];
    }
    console.log(this.currentAccount);
  }

  get chainName$(): Observable<string> {
    return this.chainId$.pipe(map((chainId) => this.networks[chainId]));
  }

  async addCustomNetwork(blockchain: string): Promise<any> {
    try {
      const rpcReq = {
        id: 1,
        jsonrpc: '2.0',
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: this.configService.config[blockchain].chainId,
            chainName: this.configService.config[blockchain].network,
            rpcUrls: [this.configService.config[blockchain].rpcUrl],
            blockExplorerUrls: [this.configService.config[blockchain].explorerUrl],
            nativeCurrency: {
              name: this.configService.config[blockchain].networkToken,
              symbol: this.configService.config[blockchain].networkToken,
              decimals: 18,
            },
          },
        ],
      };
      return await this.provider.request(rpcReq);
    } catch (error) {
      return error;
    }
  }

  async addCustomToken(blockchain: string): Promise<any> {
    try {
      const rpcReq = {
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: this.configService.config[blockchain].tokenContract,
            symbol: this.configService.config[blockchain].token,
            decimals: 7,
            image: 'https://s3.amazonaws.com/static.weown.com/own/WeOwn_logo_final.png',
          },
        },
      };

      const wasAdded = await this.provider.request(rpcReq);
      return wasAdded;
    } catch (error) {
      return error;
    }
  }
}
