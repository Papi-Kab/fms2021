import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Utilisateur } from '../../@common/models/utilisateur';
import { UtilisateurFirebaseService } from '../../@common/services/utilisateur-firebase.service';
import { Storage } from '@ionic/storage-angular';
import { Trajet } from '../../@common/models/trajet';
import { Network } from '@ionic-native/network/ngx';
import { TrajetFirebaseService } from '../../@common/services/trajet-firebase.service';
import { CentreFirebaseService } from 'src/app/@common/services/centre-firebase.service';
import { Centre } from 'src/app/@common/models/centres';
@Component({
  selector: 'app-trajet-add',
  templateUrl: './trajet-add.page.html',
  styleUrls: ['./trajet-add.page.scss'],
})
export class TrajetAddPage implements OnInit {

  form: FormGroup;
  public traj: Trajet;
  public centres: Centre[];
  private item: Utilisateur;
  private _storage: Storage | null = null;
  constructor(
    public serviceUser: UtilisateurFirebaseService,
    public fb: FormBuilder,
    private storage: Storage,
    private network: Network,
    public toastController: ToastController,
    public serviceFb: TrajetFirebaseService,
    private router: Router,
    private serviceCentre: CentreFirebaseService,
  ) { }

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
      heureDepart: this.fb.control(this.traj.heureDepart, [Validators.required]),
      centre: this.fb.control(this.traj.centre, [Validators.required]),
      domicile: this.fb.control(this.traj.domicile, [Validators.required]),
    });
    this.subscribe();
  }
  subscribe() {
    if (!this.buildForm) {
      this.buildForm();
    }
    this.form.get('heureDepart').valueChanges.subscribe(value => this.traj.heureDepart = value);
    this.form.get('centre').valueChanges.subscribe(value => this.traj.centre = value.trim());
    this.form.get('domicile').valueChanges.subscribe(value => this.traj.domicile = value.trim());
  }

  save() {
     if (this.network.type === 'none') {
      this.errorConnexion();
     } else {
       this.serviceFb.saveDocument(this.traj).then(tr => {
         this.successTrajet().then(() => {
           this.router.navigateByUrl('/home');
         });
       }).catch(error => {
         this.errorTrajet(error);
       });
    }
  }

  // saveTrajet(){
  //   console.log(this.traj);
  // }

  async errorTrajet(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    toast.present();
  }

  async successTrajet() {
    const toast = await this.toastController.create({
      message: 'Trajet créé avec succès',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
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

}
