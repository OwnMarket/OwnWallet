import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WalletInfo } from '../models/wallet-info.model';
import { WalletContext } from '../models/wallet-context.model';
import * as _ from 'lodash';
import { CryptoService } from "../services/crypto.service";
import { PrivatekeyService } from './privatekey.service';
import { RestoreWalletComponent } from '../hdcrypto/restore-wallet.component';

@Injectable({
providedIn: 'root'
})
export class WalletService {

    constructor(private cryptoService: CryptoService, 
        private privateKeyService: PrivatekeyService) { }

    private context: WalletContext;

    private subject = new Subject<any>();

    setWalletContext (context: WalletContext) {
        this.context = context;
        localStorage.setItem("walletKeyStore", context.walletKeystore);
    }

    getWalletContext (): WalletContext {
        return {
            walletKeystore: localStorage.getItem('walletKeyStore'),
            passwordHash: this.context ? this.context.passwordHash : null 
        }
    }

    getWalletInfo (chxAddress: string) : Observable<any>{
        let context = this.getWalletContext();
        if (!context.passwordHash || !context.walletKeystore)
            return null;
            
        var addresses = JSON.parse(localStorage.getItem('walletChxAddresses')) || [];
        var index = addresses.indexOf(chxAddress);
        if (index >= 0) {     
            return this.cryptoService.generateWalletFromKeystore(
                context.walletKeystore,
                context.passwordHash, 
                index);        
        }
    }

    getAllChxAddresses () {
        return JSON.parse(localStorage.getItem('walletChxAddresses')) || []
    }

    getSelectedChxAddress () {
        return localStorage.getItem('walletSelectedChxAddress');
    }

    setSelectedChxAddress (chxAddress: string) {
        localStorage.setItem('walletSelectedChxAddress', chxAddress);
    }

    sendMessage(message: boolean) {
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    createNewChxAddress () {
        let index = this.getNextWalletIndex(); 
        this.createChxAddress(index);
    }

    generateWalletFromContext() { 
        this.createChxAddress(0);     
    }

    clearWalletContext() {
        localStorage.removeItem('walletKeyStore');
        localStorage.removeItem('walletChxAddresses');
        localStorage.removeItem('walletSelectedChxAddress');
        this.context = null;
    }

    unloadWallet() {
        this.clearWalletContext();
        this.privateKeyService.setWalletInfo(null);
        this.sendMessage(true);
    }

    private createChxAddress(index: number) {
        let context = this.getWalletContext();
        if (!context.passwordHash || !context.walletKeystore)
            return;
                
        this.cryptoService.generateWalletFromKeystore(context.walletKeystore, context.passwordHash, index)
            .subscribe((wallet: WalletInfo) => {
                this.addAddressToStorage(wallet.address);
                let selectedChxAddress = this.getSelectedChxAddress();
                let chxAddresses = this.getAllChxAddresses();
                let isValidSelectedChxAddress = selectedChxAddress && chxAddresses.indexOf(selectedChxAddress) >= 0;
                if (index == 0 && isValidSelectedChxAddress) {
                    this.getWalletInfo(selectedChxAddress)
                        .subscribe (walletInfo => this.privateKeyService.setWalletInfo(walletInfo));
                } 
                else {
                    this.privateKeyService.setWalletInfo(wallet);
                }
                
                this.privateKeyService.sendMessage(this.privateKeyService.existsKey());          
        });        
    }

    private addAddressToStorage(address : string) {
        var addresses = JSON.parse(localStorage.getItem('walletChxAddresses')) || [];
        var addressExists = addresses.find((a: string) => a == address);
        if (!addressExists) {
            addresses.push(address);
            localStorage.setItem('walletChxAddresses', JSON.stringify(addresses));      
        }    
    }

    private getNextWalletIndex(){
        var addresses = JSON.parse(localStorage.getItem('walletChxAddresses')) || [];
        return addresses.length;
    }
}
