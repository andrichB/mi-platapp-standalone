/* Configuracion default de Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}
*/
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  user
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  addDoc
} from '@angular/fire/firestore';
import {
  Observable,
  BehaviorSubject,
  from,
  catchError,
  map,
  throwError
} from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  register(email: string, password: string, name: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((cred) => {
        const user = cred.user;

        // 1. Actualiza el perfil del usuario en Firebase Auth
        return from(updateProfile(user, { displayName: name })).pipe(
          switchMap(() => {
            // 2. Almacena al usuario en Firestore
            const userRef = doc(this.firestore, `usuarios/${user.uid}`);
            return from(setDoc(userRef, {
              uid: user.uid,
              nombre: name,
              email: email
            })).pipe(
              switchMap(() => {
                // 3. Crea una cuenta predeterminada (opcional)
                const cuentasRef = collection(this.firestore, 'cuentas');
                return from(addDoc(cuentasRef, {
                  usuarioId: user.uid,
                  nombre: 'Cuenta de Ahorros',
                  tipo: 'Banco',
                  saldoInicial: 0
                })).pipe(
                  map(() => void 0)
                );
              }),
              tap(() => {
                this.toastService.showSuccess('Registro exitoso!');
                this.router.navigate(['/home']);
              })
            );
          })
        );
      }),
      catchError((error) => {
        this.toastService.showError(this.getFirebaseErrorMessage(error.code));
        return throwError(() => error);
      })
    );
  }

  // Otros métodos como login, logout...

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/operation-not-allowed':
        return 'Operación no permitida.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      default:
        return 'Ocurrió un error. Intenta nuevamente.';
    }
  }

// Método para obtener el usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // También puedes devolverlo como promesa si lo prefieres:
  async getCurrentUserAsync(): Promise<User | null> {
    return await this.auth.currentUser;
  }

  // Alternativamente, puedes exponer un observable del usuario actual:
  getCurrentUser$() {
    return user(this.auth); // devuelve un Observable<User | null>
  }

}
