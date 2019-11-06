import {
  Component,
  Input,
  ViewChild,
  ContentChildren,
  QueryList,
  ElementRef,
} from '@angular/core';

import { OwnSlideComponent } from '../own-slide/own-slide.component';

@Component({
  selector: 'own-slider',
  templateUrl: './own-slider.component.html',
  styleUrls: ['./own-slider.component.css']
})
export class OwnSliderComponent {

  @ContentChildren(OwnSlideComponent) slides: QueryList<OwnSlideComponent>;
  @ViewChild('stage') stage: ElementRef;

  @Input() showDots = true;

  currentSlide = 0;

  get stageWidth(): number {
      return ((OwnSlideComponent.width + OwnSlideComponent.margin) * this.slides.length) * 2;
  }

  get dots(): any[] {
      return new Array(this.slides.length);
  }

  next() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.slideTo(this.currentSlide);
    } else {
      this.reset();
    }
  }

  prev() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.slideTo(this.currentSlide);
    }
  }

  goTo(index: number) {
    this.currentSlide = index;
    this.slideTo(this.currentSlide);
  }

  slideTo(slide: number) {
    const slideWidth = OwnSlideComponent.width;
    const margin = OwnSlideComponent.margin;
    const x = (slideWidth + margin) * slide;
    this.stage.nativeElement.style.transform = `translateX(-${x}px)`;
  }

  reset() {
    this.currentSlide = 0;
    this.stage.nativeElement.style.transform = `translateX(0)`;
  }

  keyboardControl(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowRight':
            this.next();
            break;
        case 'ArrowLeft':
            this.prev();
            break;
    }
  }

   /*  Use if PAN events are enabled (pan)="scrollX($event)"
  scrollX(event: any) {

    this.stage.nativeElement.style.cursor = 'grab';
    const percentage = 100 / this.slides.length * event.deltaX / window.innerWidth;
    const transformPercentage = percentage - 100 / this.slides.length * this.currentSlide;
    this.stage.nativeElement.style.transform = 'translateX( ' + transformPercentage + '% )';

    if (event.isFinal) {
      if (percentage < 0) {
        this.slideTo(this.currentSlide + 1);
      } else if (percentage > 0 && this.currentSlide > 0) {
        this.slideTo(this.currentSlide - 1);
      } else {
        this.slideTo(this.currentSlide);
      }
      this.stage.nativeElement.style.cursor = 'auto';
    }

  }
  */

}
