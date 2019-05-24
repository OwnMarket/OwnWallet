import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PrivatekeyService } from '../services/privatekey.service';
import { CryptoService } from "../services/crypto.service";
import { WalletService } from '../services/wallet.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-restore-wallet',
    templateUrl: './restore-wallet.component.html',
})
export class RestoreWalletComponent implements OnInit {
    password = new FormControl('', [Validators.required]);
    mnemonic = new FormControl('', [Validators.required]);

    file: any;
    walletKeystore: string;
    privateKey : string;

    hideWithMnemonic: boolean;
    hideWithKeystore: boolean;
    hideWithPrivateKey : boolean;
    wrongPassword: boolean;
    
    constructor(private router: Router,
        private privateKeyService: PrivatekeyService,
        private cryptoService: CryptoService,
        private walletService: WalletService) {
        this.hideWithMnemonic = true;
        this.hideWithKeystore = true;
        this.hideWithPrivateKey = true;
        this.wrongPassword = false;
        this.privateKey = ''
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
        this.walletService.clearWalletContext();

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
                this.walletService.generateWalletFromContext();

                this.router.navigate(['/home']);
            }
            catch {
                this.wrongPassword = true;
            }
        }
    }

    onRestoreWithMnemonic() {
        this.walletService.clearWalletContext();

        this.mnemonic.markAsTouched();
        this.password.markAsTouched();

        if (this.password.valid && this.mnemonic.valid) {
            const passwordHash = this.cryptoService.hash(this.password.value);
            this.cryptoService.generateWalletKeystore(this.mnemonic.value, passwordHash)
                .subscribe((walletKeystore: string) => {
                    const walletContext = { walletKeystore, passwordHash };
                    this.walletService.setWalletContext(walletContext);
                    this.walletService.generateWalletFromContext();

                    this.router.navigate(['/home']);
                });
        }
    }

    onRestoreWithPrivateKey() {
        this.walletService.clearWalletContext();
        
        if(!this.privateKey)
        return;
    
        this.cryptoService.getAddressFromKey(this.privateKey).subscribe(address => {
            if(!address && !address.errors)
                return;        

            this.privateKeyService.setWalletInfo({
                privateKey : this.privateKey,
                address : (address as string)
            });

            this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
            this.router.navigate(['/home']);
        }); 
    }
}
