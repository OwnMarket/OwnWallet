import { Component, Input } from '@angular/core';

@Component({
  selector: 'own-card-body',
  templateUrl: './own-card-body.component.html',
  styleUrls: ['./own-card-body.component.css']
})
export class OwnCardBodyComponent {
  @Input() padding = false;
}
