import { Component, OnInit } from '@angular/core';
import { PrivatekeyService } from '../services/privatekey.service';
import { CryptoService } from '../services/crypto.service';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-import-wallet',
    templateUrl: './import-wallet.component.html',
    styleUrls: ['./import-wallet.component.css']
})
export class ImportWalletComponent implements OnInit {
    hide : boolean;
    privateKey : string;
    errors: string[];
    constructor(private privateKeyService : PrivatekeyService, 
        private cryptoService : CryptoService,
        private walletService : WalletService) {
        this.hide = true;
        this.privateKey = '';
    }

    onImportButtonClick() {
        if(!this.privateKey)
            return;
        
        this.cryptoService.getAddressFromKey(this.privateKey).subscribe(address => {
            if(!address && !address.errors)
                return;        

            this.privateKeyService.setWalletInfo({
                privateKey : this.privateKey,
                address : (address as string)
            });

            this.displayErrors(address);            
            this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
        });     
    }

    ngOnInit() {
        this.privateKeyService.getMessage().subscribe(msg => {
            let walletInfo = this.privateKeyService.getWalletInfo();
            if (walletInfo) 
                this.displayErrors(walletInfo.address);
        });
    }

    private displayErrors(address: string) {
        let chxAddresses = this.walletService.getAllChxAddresses();
        if (chxAddresses.indexOf(address) == -1){
            this.errors = ["Imported key is not recoverable. Your PK will be unloaded from the wallet upon closing the application or clicking the Unload Private Key button"];
        }
        else {
            this.errors = null;
        }
    }
}

