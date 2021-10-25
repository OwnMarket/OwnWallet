import { Component, Input, HostListener } from '@angular/core';
import { ownIcons } from './own-icons';
@Component({
  selector: 'own-icon',
  templateUrl: './own-icon.component.html',
  styleUrls: ['./own-icon.component.css'],
})
export class OwnIconComponent {
  _icon: any;
  _oldColor: string;

  @Input() set icon(value: string) {
    if (typeof ownIcons[value] !== 'undefined') {
      this._icon = ownIcons[value];
    }
  }

  @Input() size = 20;
  @Input() color = '#848484';
  @Input() viewBox = '0 0 475.084 475.084';
  @Input() hoverColor: string;

  @HostListener('mouseover')
  onHover() {
    if (this.hoverColor) {
      this._oldColor = this.color;
      this.color = this.hoverColor;
    }
  }

  @HostListener('mouseout')
  onHoverEnd() {
    if (this.hoverColor) {
      this.color = this._oldColor;
    }
  }
}
