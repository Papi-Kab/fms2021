/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Network } from '@ionic-native/network/ngx';
import { Utilisateur } from './../@common/models/utilisateur';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UtilisateurFirebaseService } from '../@common/services/utilisateur-firebase.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  fbcollection: AngularFirestoreCollection;
  itemDoc: AngularFirestoreDocument<Utilisateur>;
  form: FormGroup;
  item: Utilisateur;
  password: string;
  image = '../assets/image/user.png';
  task: any;
  constructor(
    private network: Network,
    public toastController: ToastController,
    public fb: FormBuilder,
    public afAuth: AngularFireAuth,
    public afFS: AngularFirestore,
    public afSG: AngularFireStorage,
    public serviceUser: UtilisateurFirebaseService,
    private camera: Camera,
    public asc: ActionSheetController,
  ) { }

  ngOnInit() {
    this.item = new Utilisateur();
    this.buildForm();
    this.fbcollection = this.afFS.collection('utilisateur');
  }
  buildForm() {
    this.form = this.fb.group({
      nom: this.fb.control(this.item.nom, [Validators.required]),
      telephone: this.fb.control(this.item.telephone, [Validators.required]),
      email: this.fb.control(this.item.email, [Validators.required, emailValidator]),
      domicile: this.fb.control(this.item.domicile, [Validators.required]),
      centre: this.fb.control(this.item.centre, [Validators.required]),
      password: this.fb.control(this.password, [Validators.required]),
    });
    this.subscribe();
  }
   //Sauvegarde du user
  save(){
    if (this.network.type === 'none') {
      this.errorConnexion();
    } else {

      this.afAuth.createUserWithEmailAndPassword(this.item.email,
        this.password)
        .then(auth => {
          this.item.id = auth.user.uid;
          this.saveToUser();
        })
        .catch(err => {
          console.log('Erreur: ' + err);
          this.errorInscription(err);
        });

    }
  }
  saveToUser() {
    this.task = this.afSG.ref('photo').child(this.item.id).putString(this.image, 'data_url');
    this.task.then(res => {
      this.serviceUser.saveDocument(this.item)
        .then(async resp => {
          const photoLink = await this.afSG.ref(`photo/${this.item.id}`).getDownloadURL().toPromise();
          this.item.photo = photoLink;
          this.serviceUser.updateDocument(this.item)
            .then(async respo => {
            }).catch(error => {
            });
          this.successInscription();
        }).catch(error => {
          //console.log(error);
          this.errorInscription(error);
        });
    });
  }
    async successInscription() {
    const toast = await this.toastController.create({
      message: 'Profil créé avec succès',
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

  async errorInscription(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    toast.present();
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
  private subscribe(){
    this.form.get('nom').valueChanges.subscribe(value => this.item.nom = value.trim());
    this.form.get('telephone').valueChanges.subscribe(value => this.item.telephone = value.trim());
    this.form.get('email').valueChanges.subscribe(value => this.item.email = value.trim());
    this.form.get('domicile').valueChanges.subscribe(value => this.item.domicile = value.trim());
    this.form.get('centre').valueChanges.subscribe(value => this.item.centre = value.trim());
    this.form.get('password').valueChanges.subscribe(value => this.password = value.trim());
  }



}
export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}
