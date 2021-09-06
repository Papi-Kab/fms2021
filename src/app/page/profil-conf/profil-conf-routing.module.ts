import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilConfPage } from './profil-conf.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilConfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilConfPageRoutingModule {}
