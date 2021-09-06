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
    const ref = this.afFS.collection('trajets', refe => refe.where('statut', '==', 'C'));
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
