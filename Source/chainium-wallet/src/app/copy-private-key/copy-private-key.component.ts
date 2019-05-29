import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { WalletInfo } from '../models/wallet-info.model';
import { PrivatekeyService } from '../services/privatekey.service';

@Component({
  selector: "app-copy-private-key",
  templateUrl: "./copy-private-key.component.html",
  styleUrls: ["./copy-private-key.component.scss"]
})

export class CopyPrivateKeyComponent implements OnInit {
  
    walletInfo: WalletInfo;

    constructor(
        public dialogRef: MatDialogRef<CopyPrivateKeyComponent>,
        private privateKeyService: PrivatekeyService,) {
    }

    ngOnInit() {
        this.walletInfo = this.privateKeyService.getWalletInfo()
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
