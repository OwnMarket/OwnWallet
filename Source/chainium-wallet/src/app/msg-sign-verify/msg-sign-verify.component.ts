import { Component, OnInit } from "@angular/core";
import {FormControl, Validators} from '@angular/forms';

import { PrivatekeyService } from "../services/privatekey.service";
import { CryptoService } from "../services/crypto.service";

@Component({
    selector: "app-msg-sign-verify",
    templateUrl: "./msg-sign-verify.component.html",
    styleUrls: ["./msg-sign-verify.component.scss"]
})

export class MessageSignVerificationComponent implements OnInit {

    isKeyImported: boolean;
    // message = '';
    message = new FormControl('', [Validators.required]);
    signature = '';
    verificationSignature = new FormControl('', [Validators.required]);
    signerAddress = '';

    constructor(private privateKeyService: PrivatekeyService,
        private cryptoService: CryptoService) {
        this.isKeyImported = this.privateKeyService.existsKey();
    }

    ngOnInit() {
    }

    onSignMessageButtonClick(): void {
        this.message.markAsTouched();

        if (!this.message.valid || !this.isKeyImported)
            return;
        
        this.cryptoService.signMessage(this.privateKeyService.getWalletInfo().privateKey, this.message.value)
            .subscribe((signature: string) => {
                this.signature = signature;
        });
    }

    onVerifySignature(): void {
        this.verificationSignature.markAsTouched();
        this.message.markAsTouched();

        if (!this.verificationSignature.valid || !this.message.valid)
            return;
    
        this.cryptoService.verifySignature(this.verificationSignature.value, this.message.value)
            .subscribe((res: any) => this.signerAddress = res);
    }
}
