import { Component } from '@angular/core';
import { OwnAnimations } from '../../shared';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css'],
  animations: [ OwnAnimations.routerTransition ],
})
export class InfoPageComponent {

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

}
