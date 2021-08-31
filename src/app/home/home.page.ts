import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //email: string;
  constructor(private storage: Storage,
  private router: Router) {
    this.init();
  }
   init() {
     const id = this.storage.get('userId');
     if (id !== null) {
       this.router.navigateByUrl('/inscription');
     }
  }

}
