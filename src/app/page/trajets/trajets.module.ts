import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrajetsPageRoutingModule } from './trajets-routing.module';

import { TrajetsPage } from './trajets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrajetsPageRoutingModule
  ],
  declarations: [TrajetsPage]
})
export class TrajetsPageModule {}
