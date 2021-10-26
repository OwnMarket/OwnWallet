import { Component, ContentChildren, HostBinding, Input, QueryList } from '@angular/core';
import { OwnDropdownItemComponent } from '../own-dropdown-item/own-dropdown-item.component';

@Component({
  selector: 'own-dropdown-menu',
  templateUrl: './own-dropdown-menu.component.html',
  styleUrls: ['./own-dropdown-menu.component.css'],
})
export class OwnDropdownMenuComponent {
  @ContentChildren(OwnDropdownItemComponent) items: QueryList<OwnDropdownItemComponent>;
  @Input() showIcon = true;
  @Input() label;
  @Input() menuId: string;
  @Input() fullWidth: boolean = false;

  isActive = false;
  ariaLabel: string;
  ariaLabelledby: string;
  ariaDescribedby: string;

  toggle() {
    if (this.items.length > 0) {
      this.isActive = !this.isActive;
    }
  }

  get menuWidth() {
    return !this.showIcon ? (this.fullWidth ? '100%' : '212px') : '';
  }

  @HostBinding('style.width')
  width: string = !this.showIcon ? (this.fullWidth ? '100%' : '212px') : '';
}
