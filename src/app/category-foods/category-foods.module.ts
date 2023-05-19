import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryFoodsPageRoutingModule } from './category-foods-routing.module';

import { CategoryFoodsPage } from './category-foods.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryFoodsPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [CategoryFoodsPage]
})
export class CategoryFoodsPageModule {}
