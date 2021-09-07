import { ToastController } from '@ionic/angular';

import { Utilisateur } from './../@common/models/utilisateur';
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
  temp: Trajet[] = [];
  //email: string;
  item: Utilisateur;
  idUser = '';
  loaded;
  enCours = 0;
  private _storage: Storage | null = null;
  constructor(
    private storage: Storage,
    private router: Router,
    public serviceUser: UtilisateurFirebaseService,
    public serviceTrajet: TrajetFirebaseService,
  public toastController: ToastController,) {

    this.initTrajetCours();
    this.initStorage().then(() => {
      this.trajets = [];
      this.init();
    });
   // console.log(this.trajets);
  }
  initTrajetCours() {
    this.trajets = [];
    this.temp = [];
    this.serviceTrajet.getCours().subscribe(data => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      this.trajets = <Trajet[]>data;
      this.trajets.forEach(element => {
        //console.log(element.idDemandeur);
        //console.log(this.idUser);
        if (element.idDemandeur === this.idUser || element.idPreneur === this.idUser) {
          this.enCours = 1;
        }
        //console.log(element.idDemandeur === this.idUser);
      });
    });
  }

  init() {
    this._storage.get('userId').then(id => {
       if (id == null) {
         this.router.navigateByUrl('/login');
      }
       else {
          this.idUser = id;
         //console.log(this.idUser);
      }
     });
  }
  async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  annuler(demande: Trajet) {
    if (demande.idPreneur === 'NULL') {
      this.serviceTrajet.deleteDocument(demande);
      this.annul('Demande supprimer avec Succès.');
    }
    else {
      demande.idPreneur = 'NULL';
      this.serviceTrajet.updateDocument(demande).then(() => {
        this.annul('Trajet annuler avec Succès.');
      });
    }
  }

  ajouterTrajet() {
    let statut = 0;
    this.trajets.forEach(element => {
      if (element.idDemandeur === this.idUser) {
        statut = 1;
      }
      else if (element.idPreneur === this.idUser) {
        statut = 2;
      }
    });
    if (statut === 1 ) {
      this.cantAdd('Vous avez déjà une damande en cours.');
    }
    else if (statut === 2) {
      this.cantAdd('Vous avez accepter une demande.');
    }
    else {
      this.router.navigateByUrl('/home/new-trajet');
    }
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

  async cantAdd(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    toast.present();
  }
  async annul(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }

}
