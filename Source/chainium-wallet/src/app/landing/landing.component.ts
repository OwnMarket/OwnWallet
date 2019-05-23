import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { CryptoService } from '../services/crypto.service';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']

})
export class LandingComponent implements OnInit {

    needPasswordOnly: boolean = false;
    wrongPassword : boolean = false;
    walletKeystore: string;

    password = new FormControl('', [Validators.required]);

    constructor(private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService) {
    }

    ngOnInit() {        
        let walletContext = this.walletService.getWalletContext();
        if (walletContext.walletKeystore) {
            this.walletKeystore = walletContext.walletKeystore;
            this.needPasswordOnly = true;
        }
        else {
            this.router.navigate(['/home']);
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
                this.wrongPassword = false;
                this.walletService.setWalletContext(walletContext);
                this.router.navigate(['/home']);
            }
            catch {
                this.wrongPassword = true;
            }            
        }
    }    
}