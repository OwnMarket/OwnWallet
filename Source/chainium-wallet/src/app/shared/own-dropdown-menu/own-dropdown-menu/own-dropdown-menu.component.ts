import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "own-dropdown-menu",
  templateUrl: "./own-dropdown-menu.component.html",
  styleUrls: ["./own-dropdown-menu.component.css"],
})
export class OwnDropdownMenuComponent implements OnInit {
  @Input() showIcon = true;
  @Input() label;
  @Input() menuId: string;

  isActive = false;
  ariaLabel: string;
  ariaLabelledby: string;
  ariaDescribedby: string;

  constructor() {}

  ngOnInit() {}
}
