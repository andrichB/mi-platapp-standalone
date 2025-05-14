import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  // Obtener datos del usuario desde Firestore
  getUserData(user: User): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef); // Retorna los datos del usuario
  }

  // Actualizar datos del usuario en Firestore
  updateUserData(user: User, updatedData: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(userDocRef, updatedData); // Actualiza los datos del usuario
  }

  // Crear o establecer datos del usuario en Firestore
  setUserData(user: User, userData: any): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDocRef, userData); // Establece los datos del usuario
  }
}
