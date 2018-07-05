import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTERCONFIGS } from './services/AngularRouteConfigs'



@NgModule({
  imports: [ RouterModule.forRoot(ROUTERCONFIGS) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
