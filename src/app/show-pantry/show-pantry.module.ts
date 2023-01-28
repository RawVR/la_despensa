import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPantryPageRoutingModule } from './show-pantry-routing.module';

import { ShowPantryPage } from './show-pantry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPantryPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ShowPantryPage]
})
export class ShowPantryPageModule {}
