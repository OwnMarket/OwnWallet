import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { CryptoService } from "../services/crypto.service";
import { NewWallet } from '../models/new-wallet.model';

@Component({
    selector: 'app-new-wallet',
    templateUrl: './new-wallet.component.html',
})
export class NewWalletComponent {
    private settings = {
        element: {
            download: null as HTMLElement
        }
    };
    // controlled inputs
    password = new FormControl('', [Validators.required]);
    mnemonic = new FormControl('', [Validators.required]);

    @Output()
    setSeedWalletKeystore = new EventEmitter<NewWallet>();

    constructor(private cryptoService: CryptoService) {
    }

    onGenerateMnemonic() {
        this.cryptoService.generateMnemonic()
            .subscribe((mnemonic: string) => {
                this.mnemonic.setValue(mnemonic);
            });
    }

    onSaveKeystore() {
        this.mnemonic.markAsTouched();
        this.password.markAsTouched();

        if (this.mnemonic.valid && this.password.valid) {
            this.cryptoService.generateWalletKeystore(this.mnemonic.value, this.password.value)
                .subscribe((walletKeystore: string) => {
                    this.saveFile({
                        fileName: 'wallet-backup.own',
                        text: walletKeystore
                    });

                    this.setSeedWalletKeystore.emit({ walletKeystore, password: this.password.value });
                });
        }
    }

    private saveFile(arg: {
        fileName: string,
        text: string
    }) {
        if (!this.settings.element.download) {
            this.settings.element.download = document.createElement('a');
        }
        const element = this.settings.element.download;
        const fileType = 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);
        element.dispatchEvent(new MouseEvent('click'));
    }
}
