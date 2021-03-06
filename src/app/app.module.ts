import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';


import { HttpClient, HttpClientModule } from '@angular/common/http';
export const firebaseConfig = {
  apiKey: 'AIzaSyC7YNZW6QOK9Kq5UR_MzafSjFPQQCvZxIc',
  authDomain: 'fms2021-fd5e0.firebaseapp.com',
  projectId: 'fms2021-fd5e0',
  storageBucket: 'fms2021-fd5e0.appspot.com',
  messagingSenderId: '961618366659',
  appId: '1:961618366659:web:cdca87244e29ef81459276'
};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [
    Network,
    Camera,
    HttpClient,
    Storage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],

  bootstrap: [AppComponent],
})
export class AppModule {}
