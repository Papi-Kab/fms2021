import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrajetAddPage } from './trajet-add.page';

const routes: Routes = [
  {
    path: '',
    component: TrajetAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetAddPageRoutingModule {}
