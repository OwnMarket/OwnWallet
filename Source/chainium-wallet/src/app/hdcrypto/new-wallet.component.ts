
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CryptoService } from "../services/crypto.service";
import { WalletService } from '../services/wallet.service';
import { FileService } from '../services/file.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-wallet',
    templateUrl: './new-wallet.component.html',
})
export class NewWalletComponent implements OnInit {
    // controlled inputs
    password = new FormControl('', [Validators.required]);
    mnemonic = new FormControl('', [Validators.required]);
    saveKeystore : boolean;
    hide: boolean;

    constructor(private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService,
        private fileService: FileService) {
        this.saveKeystore = true;
        this.hide = true;
    }

    ngOnInit() { 
        this.onGenerateMnemonic();
    }

    onGenerateMnemonic() {
        this.cryptoService.generateMnemonic()
            .subscribe((mnemonic: string) => this.mnemonic.setValue(mnemonic));
    }

    onCreateNewWallet() {
        this.walletService.clearWalletContext();
        this.mnemonic.markAsTouched();
        this.password.markAsTouched();

        if (this.mnemonic.valid && this.password.valid) {
            const passwordHash = this.cryptoService.hash(this.password.value);
            this.cryptoService.generateWalletKeystore(this.mnemonic.value, passwordHash)
                .subscribe((walletKeystore: string) => {
                    if (this.saveKeystore) {
                        this.fileService.saveFile({
                            fileName: 'wallet-backup.own',
                            text: walletKeystore
                        });    
                    }

                    const walletContext = { walletKeystore, passwordHash };
                    this.walletService.setWalletContext(walletContext);
                    this.walletService.generateWalletFromContext();
                    this.router.navigate(['/home']);
                });
        }
    }    
}
