import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CryptoService } from '../services/crypto.service';
import { WalletService } from '../services/wallet.service';
import { FileService } from '../services/file.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {

    needPasswordOnly: boolean;
    wrongPassword : boolean;
    walletKeystore: string;
    hide: boolean;
    showRestore: boolean;

    password = new FormControl('', [Validators.required]);    
    saveKeystore : boolean;


    constructor(private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService,
        private fileService: FileService) {
            this.hide = true;
            this.saveKeystore = true;
            this.needPasswordOnly = false;
            this.wrongPassword = false;
            this.showRestore = false;
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