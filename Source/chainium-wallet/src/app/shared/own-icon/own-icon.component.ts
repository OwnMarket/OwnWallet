import { Component, OnInit, Input } from '@angular/core';
import { ownIcons } from './own-icons';
@Component({
  selector: 'own-icon',
  templateUrl: './own-icon.component.html',
  styleUrls: ['./own-icon.component.css']
})
export class OwnIconComponent implements OnInit {



  @Input() set icon(value: string) {
    if (typeof ownIcons[value] !== 'undefined') {
      this._icon = ownIcons[value];
    }
  }

  @Input() size = 20;
  @Input() color = '#848484';

  _icon: any;

  constructor() { }

  ngOnInit() {
  }

}
