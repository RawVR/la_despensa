import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowHouseholdPage } from './show-household.page';

const routes: Routes = [
  {
    path: '',
    component: ShowHouseholdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowHouseholdPageRoutingModule {}
