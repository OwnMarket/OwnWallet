import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { UnloadWalletInfoModel } from '../models/unload-wallet-info.model';

@Component({
    selector: 'app-unload-wallet-info',
    templateUrl: './unload-wallet-info.component.html',
    styleUrls: ['./unload-wallet-info.component.css']
})
export class UnloadWalletInfoComponent implements OnInit {
    isSubmited = false;
    constructor(public dialogRef: MatDialogRef<UnloadWalletInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UnloadWalletInfoModel,
        private router: Router,
        private walletService: WalletService) { }

    ngOnInit() {
    }

    onSubmitButtonClick() {
        this.walletService.unloadWallet();
        this.isSubmited = true;
        this.dialogRef.close();
        this.router.navigate(['/home']);        
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
