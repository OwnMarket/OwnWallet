import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-own-navbar',
  templateUrl: './own-navbar.component.html',
  styleUrls: ['./own-navbar.component.scss']
})
export class OwnNavbarComponent implements OnInit {

  menuOpen = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
