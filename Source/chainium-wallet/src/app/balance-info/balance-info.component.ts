import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material';
import { ChxAddressInfo } from '../models/chx-address-info.model';
import { CryptoService } from '../services/crypto.service';
import { PrivatekeyService } from '../services/privatekey.service';
import { WalletService } from '../services/wallet.service';
import { NodeService } from '../services/node.service';
import { WalletInfo } from '../models/wallet-info.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-balance-info',
    templateUrl: './balance-info.component.html',
    styleUrls: ['./balance-info.component.css']
})
export class BalanceInfoComponent implements OnInit {
    
    addressInfo: ChxAddressInfo;
    selectedWallet: WalletInfo;
    selectedChxAddress: string;
    chxAddresses: string[] = []
    showImportedPk: boolean;

    constructor(private cryptoService: CryptoService,
        private privateKeyService: PrivatekeyService,
        private walletService: WalletService,
        private router: Router,
        private nodeService: NodeService) {
        this.onRefreshAddressInfoClick();
    
        this.privateKeyService.getMessage().subscribe(msg => this.onRefreshAddressInfoClick());
    }

    ngOnInit() {
    }

    onRefreshAddressInfoClick() {
        if (!this.privateKeyService.existsKey()) {
            this.addressInfo = null;
            this.selectWallet(null);    
            this.showImportedPk = false;
            return;
        }
        this.selectWallet(this.privateKeyService.getWalletInfo());
        this.chxAddresses = this.walletService.getAllChxAddresses();
        this.showImportedPk = this.chxAddresses.indexOf(this.selectedChxAddress) == -1;
        this.cryptoService
            .getAddressFromKey(this.privateKeyService.getWalletInfo().privateKey)
            .subscribe(addr => this.setAddress(addr));
    }

    onAddChxAddressClick() {
        this.walletService.createNewChxAddress(); 
    }

    onImportPrivateKeyClick () {
        this.router.navigate(['/importwallet']);
    }

    onChxAddressChange(e) {
        if (this.selectedChxAddress) {     
        this.walletService.getWalletInfo(this.selectedChxAddress)
            .subscribe((walletInfo) => {
                this.selectWallet(walletInfo);
                if (this.selectedWallet) {
                    this.privateKeyService.setWalletInfo(this.selectedWallet);
                    this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
                }               
            });       
        }
    }

    private setAddress(addr: any): void {
        this.nodeService
        .getAddressInfo(this.privateKeyService.getWalletInfo().address)
        .subscribe(addr => {
            if (!addr || addr.errors) {
                this.privateKeyService.setWalletInfo(null);
                this.addressInfo = null;
                return;
            }
            this.addressInfo = addr as ChxAddressInfo;
        });
    }

    private selectWallet(walletInfo: WalletInfo) {
        this.selectedWallet = walletInfo;
        this.selectedChxAddress = this.selectedWallet ? this.selectedWallet.address : null;
        if (!this.selectedChxAddress)
            this.selectedChxAddress = this.walletService.getSelectedChxAddress();    
        if (this.selectedChxAddress)
            this.walletService.setSelectedChxAddress(this.selectedChxAddress);
    }
}
