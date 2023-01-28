import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowHouseholdPageRoutingModule } from './show-household-routing.module';

import { ShowHouseholdPage } from './show-household.page';

import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowHouseholdPageRoutingModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  declarations: [ShowHouseholdPage]
})
export class ShowHouseholdPageModule {}
