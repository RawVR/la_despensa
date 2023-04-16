import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowShoppingCartPage } from './show-shopping-cart.page';

const routes: Routes = [
  {
    path: '',
    component: ShowShoppingCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowShoppingCartPageRoutingModule {}
