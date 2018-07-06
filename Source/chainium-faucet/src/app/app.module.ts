import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { GoogleMaterialModule } from './/google-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandler } from './services/global.error.handler';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@NgModule({
  entryComponents: [ErrorDialogComponent],
  declarations: [
    AppComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    GoogleMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
