import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-home-screen',
    templateUrl: './home-screen.component.html',
    styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

    constructor(private walletService: WalletService) { }

    ngOnInit() {
        this.walletService.generateWalletFromContext();
    }
}
