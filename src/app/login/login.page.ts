import { ToastController } from '@ionic/angular';
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable no-var */
import { UtilisateurLogin } from './../@common/models/utilisateur-login';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  item: UtilisateurLogin;
  form: FormGroup;
  constructor(
    private network: Network,
    public toastController: ToastController,
     public afAuth: AngularFireAuth,
    public fb: FormBuilder,
    public router: Router,
  ) { }

  ngOnInit() {
    this.item = new UtilisateurLogin();
    this.buildForm();
  }
  buildForm() {
    this.form = this.fb.group({
      email: this.fb.control(this.item.email, [Validators.required, emailValidator]),
      password: this.fb.control(this.item.password, [Validators.required]),
    });
    this.subscribe();
  }
  connexion() {
    if (this.network.type === 'none') {
      this.errorConnexion();
    } else {
      this.afAuth.signInWithEmailAndPassword(this.item.email, this.item.password).then(auth => {
        this.router.navigateByUrl('/home');
      }).catch(err => {
        console.log('Erreur: ' + err);
        this.errorConnex(err);
      });
    }
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

  async errorConnex(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    toast.present();
  }


  private subscribe(){
    this.form.get('email').valueChanges.subscribe(value => this.item.email = value.trim());
    this.form.get('password').valueChanges.subscribe(value => this.item.password = value.trim());
  }

}
export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}
