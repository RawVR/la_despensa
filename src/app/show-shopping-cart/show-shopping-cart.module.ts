import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowShoppingCartPageRoutingModule } from './show-shopping-cart-routing.module';

import { ShowShoppingCartPage } from './show-shopping-cart.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowShoppingCartPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [ShowShoppingCartPage]
})
export class ShowShoppingCartPageModule {}
