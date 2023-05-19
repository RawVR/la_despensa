import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryFoodsPage } from './category-foods.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryFoodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryFoodsPageRoutingModule {}
