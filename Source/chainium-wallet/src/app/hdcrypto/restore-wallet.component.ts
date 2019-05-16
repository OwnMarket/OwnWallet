import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NewWallet } from '../models/new-wallet.model';

@Component({
    selector: 'app-restore-wallet',
    templateUrl: './restore-wallet.component.html',
})
export class RestoreWalletComponent implements OnInit {

    file: any;
    walletKeystore: string;
    password = new FormControl('', [Validators.required]);
    mnemonic = new FormControl('', [Validators.required]);

    @Output()
    setSeedWalletKeystore = new EventEmitter<NewWallet>();

    @Output()
    setSeedMnemonic = new EventEmitter<{ mnemonic: string, password: string }>();

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
            this.setSeedWalletKeystore.emit({ walletKeystore: this.walletKeystore, password: this.password.value });
        }
    }

    onRestoreWithMnemonic() {
        this.mnemonic.markAsTouched();
        this.password.markAsTouched();

        if (this.password.valid && this.mnemonic.valid) {
            this.setSeedMnemonic.emit({ mnemonic: this.mnemonic.value, password: this.password.value });
        }
    }
}
