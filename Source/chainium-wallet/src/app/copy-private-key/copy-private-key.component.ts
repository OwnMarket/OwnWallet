import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
        @Inject(MAT_DIALOG_DATA) public data: WalletInfo) {
    }

    ngOnInit() {
        this.walletInfo = this.data
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
