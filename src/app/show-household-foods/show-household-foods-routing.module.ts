import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowHouseholdFoodsPage } from './show-household-foods.page';

const routes: Routes = [
  {
    path: '',
    component: ShowHouseholdFoodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowHouseholdFoodsPageRoutingModule {}
