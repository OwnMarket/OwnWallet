import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { PrivatekeyService } from '../../shared/services/privatekey.service';
import { CryptoService } from '../../shared/services/crypto.service';
import { OwnAnimations } from 'src/app/shared';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';

@Component({
    selector: 'app-msg-sign-verify',
    templateUrl: './msg-sign-verify.component.html',
    styleUrls: ['./msg-sign-verify.component.scss'],
    animations: [OwnAnimations.contentInOut]
})

export class MessageSignVerificationComponent implements OnInit {

    tab = 'signing';
    isKeyImported: boolean;
    signingForm: FormGroup;
    verificationForm: FormGroup;

    signature: string;
    signerAddress: string;

    constructor(
      private formBuilder: FormBuilder,
      private privateKeyService: PrivatekeyService,
      private cryptoService: CryptoService,
      private ownModalService: OwnModalService
      ) {
        this.isKeyImported = this.privateKeyService.existsKey();
      }

    ngOnInit() {

      this.signingForm = this.formBuilder.group({
        message: ['', Validators.required]
      });

      this.verificationForm = this.formBuilder.group({
        verMessage: ['', Validators.required],
        signature: ['', Validators.required]
      });

    }

    onSignMessage({ valid, value }: { valid: boolean, value: any }): void {
        if (valid && this.isKeyImported) {
          this.cryptoService.signMessage(this.privateKeyService.getWalletInfo().privateKey, value.message)
          .subscribe(
            (signature: string) => {
              this.signature = signature;
              this.ownModalService.open('signature-modal');
            }
          );
        }
    }

    onVerifySignature({ valid, value }: { valid: boolean, value: any }): void {
        if (valid && this.isKeyImported) {
          this.cryptoService.verifySignature(value.signature, value.verMessage)
          .subscribe(
            (res: any) => {
              this.signerAddress = res;
              this.ownModalService.open('verification-modal');
            }
          );
        }
    }

    closePopup(id: string) {
      this.ownModalService.close(id);
    }
}
