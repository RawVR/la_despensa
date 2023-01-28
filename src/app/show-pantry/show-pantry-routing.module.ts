import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowPantryPage } from './show-pantry.page';

const routes: Routes = [
  {
    path: '',
    component: ShowPantryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowPantryPageRoutingModule {}
