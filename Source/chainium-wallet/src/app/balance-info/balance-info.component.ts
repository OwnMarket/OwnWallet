import { Component, OnInit } from '@angular/core';
import { ChxAddressInfo } from '../models/chx-address-info.model';
import { CryptoService } from '../services/crypto.service';
import { PrivatekeyService } from '../services/privatekey.service';
import { WalletService } from '../services/wallet.service';
import { NodeService } from '../services/node.service';
import { WalletInfo } from '../models/wallet-info.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CopyPrivateKeyComponent } from '../copy-private-key/copy-private-key.component';

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
    isWalletContextValid: boolean;

    constructor(private cryptoService: CryptoService,
        private privateKeyService: PrivatekeyService,
        private walletService: WalletService,
        private router: Router,
        public dialog: MatDialog,
        private nodeService: NodeService) {
        this.onRefreshAddressInfoClick();
        this.privateKeyService.getMessage().subscribe(msg => this.onRefreshAddressInfoClick());
        this.walletService.getMessage().subscribe(() => {
            this.validateWalletContext();
        });
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
        this.validateWalletContext();
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
        this.router.navigate(['/import-wallet']);
    }

    private setActiveWallet(chxAddress: string) {
        let walletInfoPromise = this.walletService.getWalletInfo(chxAddress);
        if (walletInfoPromise) {
            walletInfoPromise.subscribe((walletInfo) => {
                this.selectWallet(walletInfo);
                if (this.selectedWallet) {
                    this.privateKeyService.setWalletInfo(this.selectedWallet);
                    this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
                }               
            });       
        }
        else 
        {
            this.privateKeyService.setWalletInfo(null);
            this.privateKeyService.sendMessage(false);
        }
    }

    onChxAddressChange(e: any) {
        if (this.selectedChxAddress) {     
            this.setActiveWallet(this.selectedChxAddress);
        }
    }

    onRemovePrivateAddress(){
        if(this.selectedChxAddress) {
            if(this.chxAddresses.indexOf(this.selectedChxAddress) == -1){
                this.selectedChxAddress = this.chxAddresses[0];
                this.setActiveWallet(this.selectedChxAddress);
                this.router.navigate(['/home']);
            }
        }
    }

    openPrivateKeyDialog() {
        this.dialog.open(CopyPrivateKeyComponent, {
            width: '50%', data: this.selectedWallet
        });
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

    private validateWalletContext() {
        var walletContext = this.walletService.getWalletContext();
        this.isWalletContextValid = walletContext.passwordHash != null && walletContext.walletKeystore != null;
    }
}
