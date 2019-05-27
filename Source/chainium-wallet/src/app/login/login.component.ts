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

    // Login
    password = new FormControl('', [Validators.required]);

    // Restore
    restorePassword = new FormControl('', [Validators.required]);
    restoreMnemonic = new FormControl('', [Validators.required]);
    hideRestorePassword: boolean;

    // Create
    createPassword = new FormControl('', [Validators.required]);
    createMnemonic = new FormControl('', [Validators.required]);
    saveKeystore : boolean;
    hideCreatePassword: boolean;

    constructor(private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService,
        private fileService: FileService) {
            this.hide = true;
            this.saveKeystore = true;
            this.hideRestorePassword = true;
            this.hideCreatePassword = true;
            this.needPasswordOnly = false;
            this.wrongPassword = false;
            this.showRestore = false;
    }

    ngOnInit() {   
        this.onGenerateMnemonic();     
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

    onRestoreWithMnemonic() {
        this.walletService.clearWalletContext();

        this.restoreMnemonic.markAsTouched();
        this.restorePassword.markAsTouched();

        if (this.restorePassword.valid && this.restoreMnemonic.valid) {
            const passwordHash = this.cryptoService.hash(this.restorePassword.value);
            this.cryptoService.generateWalletKeystore(this.restoreMnemonic.value, passwordHash)
                .subscribe((walletKeystore: string) => {
                    const walletContext = { walletKeystore, passwordHash };
                    this.walletService.setWalletContext(walletContext);
                    this.walletService.generateWalletFromContext();

                    this.router.navigate(['/home']);
                });
        }
    }
        
    onGenerateMnemonic() {
        this.cryptoService.generateMnemonic()
            .subscribe((mnemonic: string) => this.createMnemonic.setValue(mnemonic));
    }

    onCreateNewWallet() {
        this.walletService.clearWalletContext();
        this.createMnemonic.markAsTouched();
        this.createPassword.markAsTouched();

        if (this.createMnemonic.valid && this.createPassword.valid) {
            const passwordHash = this.cryptoService.hash(this.createPassword.value);
            this.cryptoService.generateWalletKeystore(this.createMnemonic.value, passwordHash)
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