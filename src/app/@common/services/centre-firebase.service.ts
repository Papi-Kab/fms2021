import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Centre } from '../models/centres';

@Injectable({
  providedIn: 'root'
})
export class CentreFirebaseService {

  fbcollection: AngularFirestoreCollection;
  itemDoc: AngularFirestoreDocument<Centre>;
  constructor(public afFS: AngularFirestore) {
    this.fbcollection = afFS.collection('trajets');
  }
  getDocumentById() {
    const ref = this.afFS.collection('centres', refe => refe);
    return ref.valueChanges();
  }
}
