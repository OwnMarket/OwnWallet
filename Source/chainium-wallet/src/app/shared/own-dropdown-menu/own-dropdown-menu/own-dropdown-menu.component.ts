import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'own-dropdown-menu',
  templateUrl: './own-dropdown-menu.component.html',
  styleUrls: ['./own-dropdown-menu.component.css'],
})
export class OwnDropdownMenuComponent {
  @Input() showIcon = true;
  @Input() label;
  @Input() menuId: string;
  @Input() fullWidth: boolean = false;

  isActive = false;
  ariaLabel: string;
  ariaLabelledby: string;
  ariaDescribedby: string;

  get menuWidth() {
    return !this.showIcon ? (this.fullWidth ? '100%' : '212px') : '';
  }

  @HostBinding('style.width')
  width: string = !this.showIcon ? (this.fullWidth ? '100%' : '212px') : '';
}
