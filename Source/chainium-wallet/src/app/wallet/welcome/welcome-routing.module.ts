import { CreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { ImportComponent } from './import/import.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
      children: [
        {
          path: 'create',
          component: CreateComponent
        },
        {
          path: 'import',
          component: ImportComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
