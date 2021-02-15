import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { StateService } from "../services/state.service";

@Component({
  selector: "own-navbar",
  templateUrl: "./own-navbar.component.html",
  styleUrls: ["./own-navbar.component.scss"],
})
export class OwnNavbarComponent {
  menuOpen = false;
  totalBalance: Observable<number>;

  constructor(private state: StateService) {
    this.totalBalance = this.state.totalBalance$;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
