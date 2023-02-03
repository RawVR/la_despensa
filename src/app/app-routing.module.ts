import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'households',
    loadChildren: () => import('./households/households.module').then( m => m.HouseholdsPageModule)
  },
  {
    path: 'shopping-carts',
    loadChildren: () => import('./shopping-carts/shopping-carts.module').then( m => m.ShoppingCartsPageModule)
  },
  {
    path: 'show-household',
    loadChildren: () => import('./show-household/show-household.module').then( m => m.ShowHouseholdPageModule)
  },
  {
    path: 'show-pantry',
    loadChildren: () => import('./show-pantry/show-pantry.module').then( m => m.ShowPantryPageModule)
  },
  {
    path: 'show-household-foods',
    loadChildren: () => import('./show-household-foods/show-household-foods.module').then( m => m.ShowHouseholdFoodsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
