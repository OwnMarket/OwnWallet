import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class GlobalErrorHandler extends ErrorHandler {
    constructor() { 
        super();
    }
  
  handleError(error) {
    this.sendMessage(error);
    super.handleError(error);
    //throw error;
  }
 
  private static subject : Subject<any> = new Subject<any>();
 
  sendMessage(message: any) {
    GlobalErrorHandler.subject.next(message);
  }

  clearMessage() {
    GlobalErrorHandler.subject.next();
  }

  getMessage(): Observable<any> {
      return GlobalErrorHandler.subject.asObservable();
  }
  
}