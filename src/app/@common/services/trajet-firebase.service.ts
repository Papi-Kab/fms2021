import { Injectable } from '@angular/core';
import { Trajet } from '../models/trajet';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TrajetFirebaseService {
fbcollection: AngularFirestoreCollection;
  itemDoc: AngularFirestoreDocument<Trajet>;
  constructor(public afFS: AngularFirestore) {
    this.fbcollection = afFS.collection('trajets');
  }
  // findDocuments(cycle, formation) {
  //   let ref = this.afFS.collection('etudiants', ref => {
  //     return ref
  //       .where('cycle', '==', cycle)
  //       .where('formation', '==', formation)
  //   })
  //   return ref.valueChanges()
  // }

  getCours() {
    const todaystart = new Date();
    todaystart.setHours(0, 0, 0);
    const start = todaystart.getTime() / 1000;//recuperation de la date debut
    const todayend = new Date();
    todayend.setHours(23, 59, 59);
    const end = todayend.getTime() / 1000;//recup de la date fin
    const ref = this.afFS.collection('trajets', refe => refe.where('dateCreation', '<=', end).where('dateCreation', '>=', start));
    return ref.valueChanges();
  }

  getDocumentById(id: string) {
    this.itemDoc = this.afFS.doc<Trajet>(`trajets/${id}`);
    return this.itemDoc.valueChanges();
  }
  updateDocument(item: Trajet) {
    return this.fbcollection.doc(item.id).update(Object.assign({}, item));
  }

  saveDocument(item: Trajet) {
    return this.fbcollection.doc(item.id).set(Object.assign({}, item));
  }
  deleteDocument(item: Trajet) {
    return this.fbcollection.doc(item.id).delete();
  }
  protected handleError(error) {
    return throwError(error);
  }
}
