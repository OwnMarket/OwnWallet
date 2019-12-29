import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnDropdownMenuComponent } from './own-dropdown-menu/own-dropdown-menu.component';
import { OwnDropdownItemComponent } from './own-dropdown-item/own-dropdown-item.component';

@NgModule({
  declarations: [
    OwnDropdownMenuComponent,
    OwnDropdownItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OwnDropdownMenuComponent,
    OwnDropdownItemComponent
  ]
})
export class OwnDropdownMenuModule { }
