import { Utilisateur } from './../@common/models/utilisateur';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  form: FormGroup;
  item: Utilisateur;
  password: string;
  image = '../assets/image/user.png';
  constructor(
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.item = new Utilisateur();
    this.buildForm();
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
   save(){
    console.log(this.item);
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
