import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';

@Component({
  selector: 'own-navbar',
  templateUrl: './own-navbar.component.html',
  styleUrls: ['./own-navbar.component.scss'],
})
export class OwnNavbarComponent {
  menuOpen = false;
  totalBalance: Observable<number>;
  totalBalanceInUsd: Observable<number>;

  constructor(private state: StateService) {
    this.totalBalance = this.state.totalBalance$;
    this.totalBalanceInUsd = this.state.getTotalUsdBalance();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
