import { Component, OnInit } from '@angular/core';
import { PrivatekeyService } from '../services/privatekey.service';
import { CryptoService } from '../services/crypto.service';
import { WalletInfo } from '../models/wallet-info.model';

@Component({
    selector: 'app-import-wallet',
    templateUrl: './import-wallet.component.html',
    styleUrls: ['./import-wallet.component.css']
})
export class ImportWalletComponent implements OnInit {
    hide : boolean;
    privateKey : string;
    constructor(private privateKeyService : PrivatekeyService, private cryptoService : CryptoService) {
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
            this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
        });     
    }

    ngOnInit() {
    }
}

