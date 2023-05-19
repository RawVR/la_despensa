import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPantryFoodPageRoutingModule } from './show-pantry-food-routing.module';

import { ShowPantryFoodPage } from './show-pantry-food.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPantryFoodPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [ShowPantryFoodPage]
})
export class ShowPantryFoodPageModule {}
