import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { PrivatekeyService } from 'src/app/services/privatekey.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { WalletService } from 'src/app/services/wallet.service';
import { FileService } from 'src/app/services/file.service';

import { validatePasswordMatch } from 'src/app/helpers/must-match.validator';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  method = 'phrase';
  registerForm: FormGroup;
  mnemonic = new FormControl('', [Validators.required]);

  file: any;
  walletKeystore: string;
  privateKey: string;

  hideWithMnemonic: boolean;
  hideWithKeystore: boolean;
  hideWithPrivateKey: boolean;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private privateKeyService: PrivatekeyService,
      private cryptoService: CryptoService,
      private walletService: WalletService,
      private fileService: FileService
      ) {
      this.hideWithMnemonic = true;
      this.hideWithKeystore = true;
      this.hideWithPrivateKey = true;
      this.privateKey = '';
  }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          saveKeystore: [true]
      }, {
          validator: validatePasswordMatch
      });
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.registerForm.controls; }

  fileChanged(e) {
      // note: For security reasons browsers do not allow getting full path of selected file.
      this.file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent) => {
          this.walletKeystore = fileReader.result.toString();
      };
      fileReader.readAsText(this.file);
  }

  onRestoreWithFile() {
      this.walletService.clearWalletContext();

      if (this.f.password.valid && this.walletKeystore) {
          const passwordHash = this.cryptoService.hash(this.f.password.value);
          const walletContext = { walletKeystore: this.walletKeystore, passwordHash };
          try {
              this.cryptoService.generateWalletFromKeystore(
                  walletContext.walletKeystore,
                  walletContext.passwordHash,
                  0
              ).subscribe(w => {});
              this.walletService.setWalletContext(walletContext);
              this.walletService.generateWalletFromContext();

              this.router.navigate(['/wallet']);
          } catch {
              this.f.password.setErrors({'incorrect' : true});
          }
      }
  }

  onRestoreWithMnemonic() {
      this.walletService.clearWalletContext();
      this.mnemonic.markAsTouched();
      this.f.password.markAsTouched();
      this.f.confirmPassword.markAsTouched();

      if (this.registerForm.valid && this.mnemonic.valid) {
          const passwordHash = this.cryptoService.hash(this.f.password.value);
          try {
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

                  this.router.navigate(['/wallet']);
              });
          } catch {
              this.mnemonic.setErrors({'incorrect': true});
          }
      }
  }

  onRestoreWithPrivateKey() {
      this.walletService.clearWalletContext();

      if (!this.privateKey) { return; }

      this.cryptoService.getAddressFromKey(this.privateKey).subscribe(address => {

        if (!address && !address.errors) { return; }
          this.privateKeyService.setWalletInfo({
              privateKey : this.privateKey,
              address : (address as string)
          });

          this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
          this.router.navigate(['/wallet']);
      });
  }

}
