import { Component, OnInit, OnDestroy,  ViewEncapsulation, ElementRef, Input} from '@angular/core';
import { OwnModalService } from '../services/own-modal.service';

@Component({
  selector: 'own-modal',
  templateUrl: './own-modal.component.html',
  styleUrls: ['./own-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OwnModalComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() width = 350;
  isOpen = false;

  constructor(
    private ownModalService: OwnModalService
  ) {}

  ngOnInit() {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.ownModalService.add(this);
  }

  ngOnDestroy(): void {
    this.ownModalService.remove(this.id);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  onClickBg(event: any) {
    event.cancelBubble = true;
    event.preventDefault();
    if (event.target.className === 'own-modal open') {
      this.close();
    }
  }

}
