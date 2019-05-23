import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CryptoService } from "../services/crypto.service";
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-restore-wallet',
    templateUrl: './restore-wallet.component.html',
})
export class RestoreWalletComponent implements OnInit {

    file: any;
    walletKeystore: string;
    password = new FormControl('', [Validators.required]);
    mnemonic = new FormControl('', [Validators.required]);
    hideWithMnemonic: boolean;
    hideWithKeystore: boolean;

    constructor(private cryptoService: CryptoService,
        private walletService: WalletService) {
        this.hideWithMnemonic = true;
        this.hideWithKeystore = true;
    }

    ngOnInit() {
    }

    fileChanged(e) {
        // note: For security reasons browsers do not allow getting full path of selected file.
        this.file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.walletKeystore = fileReader.result.toString();
        };
        fileReader.readAsText(this.file);
    }

    onRestoreWithFile() {
        this.password.markAsTouched();
        if (this.password.valid && this.walletKeystore) {
            const passwordHash = this.cryptoService.hash(this.password.value);
            const walletContext = { walletKeystore: this.walletKeystore, passwordHash };
            this.walletService.setWalletContext(walletContext);
            this.walletService.generateWalletFromContext();
        }
    }

    onRestoreWithMnemonic() {
        this.mnemonic.markAsTouched();
        this.password.markAsTouched();

        if (this.password.valid && this.mnemonic.valid) {
            const passwordHash = this.cryptoService.hash(this.password.value);
            this.cryptoService.generateWalletKeystore(this.mnemonic.value, passwordHash)
                .subscribe((walletKeystore: string) => {
                    const walletContext = { walletKeystore, passwordHash };
                    this.walletService.setWalletContext(walletContext);
                    this.walletService.generateWalletFromContext();
                });
        }
    }
}
