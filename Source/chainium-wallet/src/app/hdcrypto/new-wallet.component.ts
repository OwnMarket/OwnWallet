
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CryptoService } from "../services/crypto.service";
import { WalletService } from '../services/wallet.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-wallet',
    templateUrl: './new-wallet.component.html',
})
export class NewWalletComponent implements OnInit {
    private settings = {
        element: {
            download: null as HTMLElement
        }
    };
    // controlled inputs
    password = new FormControl('', [Validators.required]);
    mnemonic = new FormControl('', [Validators.required]);
    saveKeystore : boolean;
    hide: boolean;

    constructor(private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService) {
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
                        this.saveFile({
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

    private saveFile(arg: {fileName: string, text: string}) {
        if (!this.settings.element.download)
            this.settings.element.download = document.createElement('a');
        
        const element = this.settings.element.download;
        const fileType = 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);
        element.dispatchEvent(new MouseEvent('click'));
    }
}
