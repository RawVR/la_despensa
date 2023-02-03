import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HouseholdsPageRoutingModule } from './households-routing.module';

import { HouseholdsPage } from './households.page';

import { QRCodeModule } from 'angularx-qrcode';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HouseholdsPageRoutingModule,
    ReactiveFormsModule,
    QRCodeModule,
    TranslateModule
  ],
  declarations: [HouseholdsPage]
})
export class HouseholdsPageModule {}
