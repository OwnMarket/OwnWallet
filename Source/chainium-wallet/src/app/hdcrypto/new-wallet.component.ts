
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { CryptoService } from "../services/crypto.service";
import { WalletService } from '../services/wallet.service';
import { FileService } from '../services/file.service';
import { Router } from '@angular/router';
import { MustMatch } from '../helpers/must-match.validator';

@Component({
    selector: 'app-new-wallet',
    templateUrl: './new-wallet.component.html',
})
export class NewWalletComponent implements OnInit {
    // controlled inputs
    registerForm: FormGroup;
    mnemonic = new FormControl('', [Validators.required]);
    saveKeystore : boolean;
    hide: boolean;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private cryptoService: CryptoService,
        private walletService: WalletService,
        private fileService: FileService) {
        this.saveKeystore = true;
        this.hide = true;
    }

    ngOnInit() { 
        this.registerForm = this.formBuilder.group({
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required]),
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
        this.onGenerateMnemonic();
    }

    // Convenience getter for easy access to form fields.
    get f() { return this.registerForm.controls; }

    onGenerateMnemonic() {
        this.cryptoService.generateMnemonic()
            .subscribe((mnemonic: string) => this.mnemonic.setValue(mnemonic));
    }

    onCreateNewWallet() {
        this.walletService.clearWalletContext();
        this.mnemonic.markAsTouched();
        this.f.password.markAsTouched();
        this.f.confirmPassword.markAsTouched();

        if (this.mnemonic.valid && this.registerForm.valid) {
            const passwordHash = this.cryptoService.hash(this.f.password.value);
            this.cryptoService.generateWalletKeystore(this.mnemonic.value.trim(), passwordHash)
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
