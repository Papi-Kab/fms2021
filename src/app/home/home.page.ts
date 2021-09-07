/* eslint-disable no-underscore-dangle */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { TrajetFirebaseService } from '../@common/services/trajet-firebase.service';
import { Trajet } from '../@common/models/trajet';
import { UtilisateurFirebaseService } from '../@common/services/utilisateur-firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public search : boolean;
  selectedTab = 'demandes';
  public trajets: Trajet[] = [];
  //email: string;
  loaded;
  private _storage: Storage | null = null;
  constructor(
    private storage: Storage,
    private router: Router,
    public serviceUser: UtilisateurFirebaseService,
    public serviceTrajet: TrajetFirebaseService) {
    this.initTrajetCours();
    this.initStorage().then(() => {
      this.init();
    });
  }
  initTrajetCours() {
    this.serviceTrajet.getCours().subscribe(data => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      this.trajets = <Trajet[]> data;
    });
  }

  init() {
     const id = this._storage.get('userId');
     if (id == null) {
       this.router.navigateByUrl('/inscription');
     }
  }
  async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  ajouterTrajet() {
    this.router.navigateByUrl('/home/new-trajet');
  }

  profil() {
    this.router.navigateByUrl('/home/profil');
  }

  showSearchBar(){
    this.router.navigateByUrl('/home/search');
  }

  photoDemande(id: string) {
    return this.serviceUser.getDocumentById(id).subscribe(data => data.photo);
  }

}
