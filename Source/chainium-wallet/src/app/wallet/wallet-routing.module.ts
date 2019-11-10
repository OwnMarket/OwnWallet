import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from '../_guards/access.guard';

import { WelcomeComponent } from './welcome/welcome.component';
import { CreateComponent } from './create/create.component';
import { ImportComponent } from './import/import.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [ AccessGuard ],
    children: [
      {
        path: 'create',
        component: CreateComponent,
      },
      {
        path: 'import',
        component: ImportComponent,
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
