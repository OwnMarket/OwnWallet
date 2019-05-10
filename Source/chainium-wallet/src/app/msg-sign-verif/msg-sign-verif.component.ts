import { Component, OnInit } from "@angular/core";

import { PrivatekeyService } from "../services/privatekey.service";
import { CryptoService } from "../services/crypto.service";

@Component({
  selector: "app-msg-sign-verif",
  templateUrl: "./msg-sign-verif.component.html",
  styleUrls: ["./msg-sign-verif.component.scss"]
})

export class MessageSignVerificationComponent implements OnInit {

  isKeyImported: boolean;
  message = '';
  signature = '';
  verificationSignature = '';
  signerAddress = '';

  constructor(private privateKeyService: PrivatekeyService,
    private cryptoService: CryptoService) {
    this.isKeyImported = this.privateKeyService.existsKey();
    if (!this.isKeyImported) {
      return;
    }
  }

  ngOnInit() {
  }

  onSignMessageButtonClick(): void {
    if (!this.message) {
      return;
    }
    this.cryptoService.signMessage(this.privateKeyService.walletInfo.privateKey, this.message)
      .subscribe((signature: string) => {
        this.signature = signature;
      });
  }

  onVerifySignature(): void {
    if (!this.verificationSignature || !this.message) {
      return;
    }
    this.cryptoService.verifySignature(this.verificationSignature, this.message)
      .subscribe((res: any) => {
        console.log(res);
        this.signerAddress = res;
      });
  }
}
