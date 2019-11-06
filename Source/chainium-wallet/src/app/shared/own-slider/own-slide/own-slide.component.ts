import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'own-slide',
  templateUrl: './own-slide.component.html',
  styleUrls: ['./own-slide.component.css']
})
export class OwnSlideComponent implements OnInit {

  static width = 400;
  static margin = 15;
  static relativeWidth: number;

  @Input() set width(value: number) {
    OwnSlideComponent.width = value;
  }

  @Input() set margin(value: number) {
    OwnSlideComponent.margin = value;
  }

  @Input() set relativeWidth(value: number) {
    OwnSlideComponent.relativeWidth = value;
  }

  style = {};

  ngOnInit() {

    if (OwnSlideComponent.relativeWidth) {

      this.style = {
        width: this.calculatePercentageOf() + 'px',
        marginRight: OwnSlideComponent.margin + 'px'
      };

    } else {
      this.style = {
        width: OwnSlideComponent.width + 'px',
        marginRight: OwnSlideComponent.margin + 'px'
      };
    }

  }

  getWindowWidth(): number {
    return window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
        || 0;
  }

  calculatePercentageOf(): number {
    const wx = (OwnSlideComponent.relativeWidth / 100) * this.getWindowWidth();
    this.width = wx;
    return wx;
  }

}
