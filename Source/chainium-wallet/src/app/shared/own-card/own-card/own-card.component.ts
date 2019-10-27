import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'own-card',
  templateUrl: './own-card.component.html',
  styleUrls: ['./own-card.component.css']
})
export class OwnCardComponent {
  @Input() collapsable = false;
  @Input() transparent = false;
  collapsed = false;
}
