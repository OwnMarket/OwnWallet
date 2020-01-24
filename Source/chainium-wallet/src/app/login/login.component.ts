import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { OwnModalService } from '../shared/own-modal/services/own-modal.service';

import { CryptoService } from 'src/app/shared/services/crypto.service';
import { WalletService } from 'src/app/shared/services/wallet.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {

    needPasswordOnly: boolean;
    walletKeystore: string;
    hide: boolean;
    showRestore: boolean;

    password = new FormControl('', [Validators.required]);
    saveKeystore: boolean;


    constructor(
        private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService,
        private ownModalService: OwnModalService
        ) {
            this.hide = true;
            this.saveKeystore = true;
            this.needPasswordOnly = false;
            this.showRestore = false;
    }

    ngOnInit() {
        const walletContext = this.walletService.getWalletContext();
        if (walletContext.walletKeystore) {
            this.walletKeystore = walletContext.walletKeystore;
            this.needPasswordOnly = true;
        } else {
            this.router.navigate(['/wallet']);
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event && event.key === 'Enter') {
            this.onSubmitPassword();
        }
    }

    onSubmitPassword() {
        this.password.markAsTouched();
        if (this.password.valid && this.walletKeystore) {
            const passwordHash = this.cryptoService.hash(this.password.value);
            const walletContext = { walletKeystore: this.walletKeystore, passwordHash };
            try {
                this.cryptoService.generateWalletFromKeystore(
                    walletContext.walletKeystore,
                    walletContext.passwordHash,
                    0
                ).subscribe(w => {});
                this.walletService.setWalletContext(walletContext);
                this.router.navigate(['/wallet']);
            } catch {
                this.password.setErrors({'incorrect': true});
            }
        }
    }

    openModal(id: string) {
      this.ownModalService.open(id);
    }
    
}
