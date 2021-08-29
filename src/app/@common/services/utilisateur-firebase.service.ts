import { Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurFirebaseService {
fbcollection: AngularFirestoreCollection;
  itemDoc: AngularFirestoreDocument<Utilisateur>;
  constructor(public afFS: AngularFirestore) {
    this.fbcollection = afFS.collection('utilisateur');
  }
  // findDocuments(cycle, formation) {
  //   let ref = this.afFS.collection('etudiants', ref => {
  //     return ref
  //       .where('cycle', '==', cycle)
  //       .where('formation', '==', formation)
  //   })
  //   return ref.valueChanges()
  // }
  getDocumentById(id: string) {
    this.itemDoc = this.afFS.doc<Utilisateur>(`etudiants/${id}`);
    return this.itemDoc.valueChanges();
  }
  updateDocument(item: Utilisateur) {
    return this.fbcollection.doc(item.id).update(Object.assign({}, item));
  }

  saveDocument(item: Utilisateur) {
    return this.fbcollection.doc(item.id).set(Object.assign({}, item));
  }
  deleteDocument(item: Utilisateur) {
    return this.fbcollection.doc(item.id).delete();
  }
  protected handleError(error) {
    return throwError(error);
  }
}
