import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowPantryFoodPage } from './show-pantry-food.page';

const routes: Routes = [
  {
    path: '',
    component: ShowPantryFoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowPantryFoodPageRoutingModule {}
