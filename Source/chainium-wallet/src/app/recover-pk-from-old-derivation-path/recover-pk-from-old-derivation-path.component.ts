import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CryptoService } from "../services/crypto.service";
import { WalletInfo } from '../models/wallet-info.model';
import { ChxAddressInfo } from '../models/chx-address-info.model';
import { NodeService } from '../services/node.service';
import { MatDialog } from '@angular/material';
import { CopyPrivateKeyComponent } from '../copy-private-key/copy-private-key.component';

@Component({
    selector: 'app-recover-pk-from-old-derivation-path',
    templateUrl: './recover-pk-from-old-derivation-path.component.html',
    styleUrls: ['./recover-pk-from-old-derivation-path.component.css']
})
export class RecoverPkFromOldDerivationPathComponent implements OnInit {
    mnemonic = new FormControl('', [Validators.required]);
    wallets: WalletInfo [];
    addresses : ChxAddressInfo [];
    constructor(private cryptoService: CryptoService,
        private nodeService: NodeService,
        public dialog: MatDialog,) { } 

    ngOnInit() {
    }

    async onShowChxAddresses () { 

        this.mnemonic.markAsTouched();
        if (this.mnemonic.valid) {
            try {
                this.wallets = 
                    await this.cryptoService.restoreOldWalletsFromMnemonic(
                        this.mnemonic.value.trim(), 
                        10)
                    .toPromise();
                                
                this.addresses = [];
                for (let i = 0; i < this.wallets.length; i ++)
                {
                    let wallet = this.wallets[i];
                    this.nodeService.getAddressInfo(wallet.address)
                        .subscribe(addr => {
                            if (!addr || addr.errors)                                  
                                return;
                            
                            let addressInfo = addr as ChxAddressInfo;
                            this.addresses.push(addressInfo);
                        });         
                }             
            }
            catch {                
                this.mnemonic.setErrors({'incorrect': true});
            }
        }
    }

    openPrivateKeyDialog(index: number) {
        this.dialog.open(CopyPrivateKeyComponent, {
            width: '50%', data: this.wallets[index]
        });
    }
}
