import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) { }

  // Obtener el usuario actual
  getCurrentUser(): Observable<User | null> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return this.firestoreService.getUserData(user);
    } else {
      return new Observable(observer => observer.next(null)); // Si no hay usuario, retornamos null
    }
  }

  // Actualizar los datos del usuario
  updateUserData(updatedData: Partial<User>): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return new Observable(observer => {
        this.firestoreService.updateUserData(user, updatedData)
          .then(() => observer.next())
          .catch((error) => observer.error(error));
      });
    }
    return new Observable(observer => observer.error('No user logged in'));
  }

  // Actualizar el nombre del usuario
  updateUserName(newName: string): Observable<void> {
    return this.updateUserData({ displayName: newName });
  }

  // Actualizar el correo del usuario
  updateUserEmail(newEmail: string): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return this.authService.updateEmail(user, newEmail); // Usamos el método de AuthService
    }
    return new Observable(observer => observer.error('No user logged in'));
  }

  // Actualizar la contraseña del usuario
  updateUserPassword(newPassword: string): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return this.authService.updatePassword(user, newPassword); // Usamos el método de AuthService
    }
    return new Observable(observer => observer.error('No user logged in'));
  }
}
