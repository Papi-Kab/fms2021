import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Utilisateur } from '../../@common/models/utilisateur';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UtilisateurFirebaseService } from '../../@common/services/utilisateur-firebase.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Centre } from '../../@common/models/centres';
import { CentreFirebaseService } from '../../@common/services/centre-firebase.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-profil-conf',
  templateUrl: './profil-conf.page.html',
  styleUrls: ['./profil-conf.page.scss'],
})
export class ProfilConfPage implements OnInit {
fbcollection: AngularFirestoreCollection;
  itemDoc: AngularFirestoreDocument<Utilisateur>;
  form: FormGroup;
  item: Utilisateur;
  image = '../assets/image/user.png';
  task: any;
  statut = 0;
  public centres: Centre[];
  private _storage: Storage | null = null;
  constructor(
    private router: Router,
    private network: Network,
    public toastController: ToastController,
    public fb: FormBuilder,
    public afAuth: AngularFireAuth,
    public afFS: AngularFirestore,
    public afSG: AngularFireStorage,
    private storage: Storage,
    public serviceUser: UtilisateurFirebaseService,
    private camera: Camera,
    public asc: ActionSheetController,
    private serviceCentre: CentreFirebaseService,
  ) {}

  ngOnInit() {
    this.centres = null;
    this.item = new Utilisateur();
    this.initStorage().then(() => {
       this._storage.get('userId').then(idUser => {
         this.serviceUser.getDocumentById(idUser).subscribe(data =>{
           this.item = data;
           this.image = this.item.photo;
           this.buildForm();
         });
       });
    });
    this.search();
    this.buildForm();
  }
  
  buildForm() {
    this.form = this.fb.group({
      nom: this.fb.control(this.item.nom, [Validators.required]),
      telephone: this.fb.control(this.item.telephone, [Validators.required]),
      email: this.fb.control(this.item.email, [Validators.required, emailValidator]),
      domicile: this.fb.control(this.item.domicile, [Validators.required]),
      centre: this.fb.control(this.item.centre, [Validators.required]),
    });
    this.subscribe();
  }

  subscribe(){
    this.form.get('nom').valueChanges.subscribe(value => this.item.nom = value.trim());
    this.form.get('telephone').valueChanges.subscribe(value => this.item.telephone = value.trim());
    this.form.get('email').valueChanges.subscribe(value => this.item.email = value.trim());
    this.form.get('domicile').valueChanges.subscribe(value => this.item.domicile = value.trim());
    this.form.get('centre').valueChanges.subscribe(value => this.item.centre = value.trim());
    
  }
  
  search() {
  this.serviceCentre.getDocumentById().subscribe(data => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.centres = <Centre[]>data;
    });
  }

  Modify(){
    this.statut = 1;
  }

  logOut(){
    this._storage?.set('userId', null);
    this.router.navigateByUrl('/login');

  }
   async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  update() {
    this.serviceUser.updateDocument(this.item)
      .then(async resp => {
        const toast = await this.toastController.create({
          message: 'Profil modifié avec succès',
          duration: 2000,
          position: 'bottom',
          color: 'success',
        });
        toast.present();
      }).catch(error => {
        console.log(error);
      })
      this.statut = 0;
  }

    //Pour les photos
  async addPhoto() {
    const actionSheet = await this.asc.create({
      header: 'Choisir une photo de profil',
      buttons: [{
        text: 'Caméra',
        icon: 'camera',
        handler: () => {
          this.addPhotoFromCamera();
        }
      }, {
        text: 'Galerie',
        icon: 'images',
        handler: () => {
          this.addPhotoFromGalerie();
        }
      },
      {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Annuler');
        }
      }]
    });
    await actionSheet.present();
  }
  async addPhotoFromGalerie() {
    const base64 = await this.captureImageGalerie();
    this.createUploadTask(base64);
  }

  async addPhotoFromCamera() {
    const base64 = await this.captureImageCamera();
    this.createUploadTask(base64);
  }
  createUploadTask(file: string): void {
    this.image = 'data:image/jpg;base64,' + file;
  }
  async captureImageGalerie() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
  async captureImageCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }


}
export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}