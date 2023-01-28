import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HouseholdsPageRoutingModule } from './households-routing.module';

import { HouseholdsPage } from './households.page';

import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HouseholdsPageRoutingModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  declarations: [HouseholdsPage]
})
export class HouseholdsPageModule {}
