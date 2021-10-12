import { Component, Input } from '@angular/core';

@Component({
  selector: 'own-dropdown-item',
  templateUrl: './own-dropdown-item.component.html',
  styleUrls: ['./own-dropdown-item.component.css'],
})
export class OwnDropdownItemComponent {
  @Input() hasPadding = true;
}
