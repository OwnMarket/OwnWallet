import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { CryptoService } from 'src/app/services/crypto.service';
import { WalletService } from 'src/app/services/wallet.service';
import { FileService } from 'src/app/services/file.service';
import { validatePasswordMatch } from 'src/app/helpers/must-match.validator';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

     // controlled inputs
     registerForm: FormGroup;
     mnemonic = new FormControl('', [Validators.required]);
     hide: boolean;

     constructor(
       private formBuilder: FormBuilder,
         private router: Router,
         private cryptoService: CryptoService,
         private walletService: WalletService,
         private fileService: FileService) {
         this.hide = true;
     }

     ngOnInit() {
         this.registerForm = this.formBuilder.group({
             password: ['', [Validators.required]],
             confirmPassword: ['', [Validators.required]],
             saveKeystore: [true]
         }, {
             validator: validatePasswordMatch
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
                     if (this.f.saveKeystore.value) {
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
