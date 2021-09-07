import { CentreFirebaseService } from 'src/app/@common/services/centre-firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import { TrajetFirebaseService } from './../../@common/services/trajet-firebase.service';
import { ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { UtilisateurFirebaseService } from './../../@common/services/utilisateur-firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from './../../@common/models/utilisateur';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Centre } from 'src/app/@common/models/centres';
import { Trajet } from 'src/app/@common/models/trajet';
import { TrajetRech } from 'src/app/@common/models/trajet-rech';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public traj: Trajet;
  form: FormGroup;
  mform: TrajetRech;
  public centres: Centre[];
  private item: Utilisateur;
  private _storage: Storage | null = null;
  dateCreation: Date;
  constructor(
    public serviceUser: UtilisateurFirebaseService,
    public fb: FormBuilder,
    private storage: Storage,
    private network: Network,
    public toastController: ToastController,
    public serviceFb: TrajetFirebaseService,
    private router: Router,
    private serviceCentre: CentreFirebaseService,
  ) {
    this.mform = new TrajetRech();
    this.dateCreation = new Date();
   }

  ngOnInit() {
    this.centres = null;


    //initialisation des éléments qui doivent l'être
    this.traj = new Trajet();
    this.traj.dateCreation = new Date();
    this.traj.statut = 'C';
    this.traj.idPreneur = 'NULL';
    this.initStorage().then(() => {
      this._storage.get('userId').then(idUser => {
        this.serviceUser.getDocumentById(idUser).subscribe(data => {
          this.item = data;
          //ici je donne d'id du demandeur
          this.traj.idDemandeur = this.item.id;
          this.traj.domicile = this.item.domicile;
          this.traj.centre = this.item.centre;
          this.traj.photoDemande = this.item.photo;
          this.buildForm();
          //console.log(this.item);
        });
      });

    });
    this.buildForm();
    this.search();
   //this.serviceUser.getDocumentById
  }

  search() {
    this.serviceCentre.getDocumentById().subscribe(data => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      this.centres = <Centre[]>data;
    });
  }
  buildForm() {
    this.form = this.fb.group({
      centre: this.fb.control(this.traj.centre, [Validators.required]),
      domicile: this.fb.control(this.traj.domicile, [Validators.required]),
    });
    this.subscribe();
  }
  subscribe() {
    if (!this.buildForm) {
      this.buildForm();
    }
    this.form.get('centre').valueChanges.subscribe(value => this.traj.centre = value.trim());
    this.form.get('domicile').valueChanges.subscribe(value => this.traj.domicile = value.trim());
  }

  async errorConnexion() {
    const toast = await this.toastController.create({
      message: 'Aucune connexion internet.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    toast.present();
  }

  async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  rechercher() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        dataRec: this.mform,
      }
    };
    this.router.navigate(['/etudiants'], navigationExtras);
  }

}
