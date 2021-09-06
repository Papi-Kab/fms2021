import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilConfPageRoutingModule } from './profil-conf-routing.module';

import { ProfilConfPage } from './profil-conf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilConfPageRoutingModule
  ],
  declarations: [ProfilConfPage]
})
export class ProfilConfPageModule {}
