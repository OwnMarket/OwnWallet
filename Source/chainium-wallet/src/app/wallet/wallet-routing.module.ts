import { ValidatorManagmentComponent } from './validator-managment/validator-managment.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from '../_guards/access.guard';

import { WelcomeComponent } from './welcome/welcome.component';
import { CreateComponent } from './create/create.component';
import { ImportComponent } from './import/import.component';
import { SendChxComponent } from './actions/send-chx/send-chx.component';
import { ReceiveChxComponent } from './actions/receive-chx/receive-chx.component';

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
      },
      {
        path: 'send-chx',
        component: SendChxComponent
      },
      {
        path: 'receive-chx',
        component: ReceiveChxComponent
      },
      {
        path: 'validator-managment',
        component: ValidatorManagmentComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
