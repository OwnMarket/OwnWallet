import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskStatus } from '../enums/metamask-status.enum';

@Injectable({ providedIn: 'root' })
export class MetamaskService {
  web3: Web3;
  provider: any;

  chainId: string;
  currentAccount: string;

  private errorSubj: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private statusSubj: BehaviorSubject<MetaMaskStatus> = new BehaviorSubject<MetaMaskStatus>(
    MetaMaskStatus.Disconnected
  );
  error$: Observable<string | null> = this.errorSubj.asObservable();
  status$: Observable<MetaMaskStatus> = this.statusSubj.asObservable();

  constructor() {
    this.provider = window.ethereum as any;
    if (this.provider && this.provider.isMetaMask && this.provider.selectedAddress) {
      console.log('MetaMaskService: MetaMask installed');
      this.init();
    }
  }

  async init() {
    this.statusSubj.next(MetaMaskStatus.Initiating);
    this.web3 = new Web3(Web3.givenProvider);
    this.provider = await detectEthereumProvider();
    this.web3.setProvider(this.provider);
    this.chainId = await this.provider.request({ method: 'eth_chainId' });

    this.provider.on('disconnect', () => {
      this.statusSubj.next(MetaMaskStatus.Disconnected);
    });

    this.provider.on('chainChanged', (chainId: string) => {
      this.chainId = chainId;
    });

    this.provider.on('accountsChanged', async (accounts: string[]) => await this.syncAccounts(accounts));
    await this.connect();
  }

  async connect() {
    try {
      this.statusSubj.next(MetaMaskStatus.Connecting);
      const accounts: string[] = await this.provider.request('eth_requestAccounts');
      await this.syncAccounts(accounts);
    } catch (error: any) {
      this.statusSubj.next(MetaMaskStatus.Disconnected);
      this.errorSubj.next(error);
    }
  }

  async syncAccounts(accounts: string[]) {
    this.statusSubj.next(MetaMaskStatus.Connected);
    if (accounts.length === 0) {
      this.errorSubj.next(`Your MetaMask wallet is locked or you didn't connect any accounts.`);
    }
    if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
    }
  }

  async addCustomNetwork(blockchain: string) {}

  async addCustomToken(blockchain: string) {}
}
