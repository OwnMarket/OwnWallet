
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {LoaderMessage } from '../models/LoaderMessage';

@Injectable({providedIn: 'root'})
export class WalletHttpInterceptor implements HttpInterceptor {
    private static subject = new Subject<LoaderMessage>();
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.sendMessage(LoaderMessage.Start);

        return next.handle(req).pipe(
            tap(() => { },
                () => { this.sendMessage(LoaderMessage.End); },
                () => { this.sendMessage(LoaderMessage.End); }
            )
        );
    }

    sendMessage(message: LoaderMessage) {
        WalletHttpInterceptor.subject.next(message);
    }

    clearMessage() {
        WalletHttpInterceptor.subject.next();
    }

    getMessage(): Observable<LoaderMessage> {
        return WalletHttpInterceptor.subject.asObservable();
    }
}
