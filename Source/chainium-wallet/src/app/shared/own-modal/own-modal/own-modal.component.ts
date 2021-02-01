import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input,
} from "@angular/core";
import { OwnModalService } from "../services/own-modal.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "own-modal",
  templateUrl: "./own-modal.component.html",
  styleUrls: ["./own-modal.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OwnModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() width = 350;

  isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errors: any[];

  constructor(private ownModalService: OwnModalService) {}

  ngOnInit() {
    if (!this.id) {
      console.error("modal must have an id");
      return;
    }
    this.ownModalService.add(this);
  }

  ngOnDestroy() {
    this.ownModalService.remove(this.id);
  }

  open() {
    this.isOpen.next(true);
  }

  close() {
    this.isOpen.next(false);
  }

  onClickBg(event: any) {
    event.cancelBubble = true;
    event.preventDefault();
    if (event.target.className === "own-modal open") {
      this.close();
    }
  }
}
