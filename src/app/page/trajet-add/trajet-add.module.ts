import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrajetAddPageRoutingModule } from './trajet-add-routing.module';

import { TrajetAddPage } from './trajet-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TrajetAddPageRoutingModule
  ],
  declarations: [TrajetAddPage]
})
export class TrajetAddPageModule {}
