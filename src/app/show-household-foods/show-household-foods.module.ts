import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowHouseholdFoodsPageRoutingModule } from './show-household-foods-routing.module';

import { ShowHouseholdFoodsPage } from './show-household-foods.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowHouseholdFoodsPageRoutingModule,
    TranslateModule
  ],
  declarations: [ShowHouseholdFoodsPage]
})
export class ShowHouseholdFoodsPageModule {}
