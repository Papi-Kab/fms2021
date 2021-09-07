import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'new-trajet',
    loadChildren: () => import('../page/trajet-add/trajet-add.module').then( m => m.TrajetAddPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('../page/profil-conf/profil-conf.module').then( m => m.ProfilConfPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('../page/search/search.module').then( m => m.SearchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
