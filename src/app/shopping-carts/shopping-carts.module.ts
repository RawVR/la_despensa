import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingCartsPageRoutingModule } from './shopping-carts-routing.module';

import { ShoppingCartsPage } from './shopping-carts.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingCartsPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [ShoppingCartsPage]
})
export class ShoppingCartsPageModule {}
