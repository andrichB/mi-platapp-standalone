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
  User
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc
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

      // Actualizar perfil
      return from(updateProfile(user, { displayName: name })).pipe(
        switchMap(() => {
          const userRef = doc(this.firestore, `usuarios/${user.uid}`);
          return from(setDoc(userRef, {
            uid: user.uid,
            nombre: name,
            email: email
          }));
        }),
        tap(() => {
          this.toastService.showSuccess('Registro exitoso!');
          this.router.navigate(['/tabs/tabHome']);
        })
      );
    }),
    catchError((error) => {
      this.toastService.showError(this.getFirebaseErrorMessage(error.code));
      return throwError(() => error);
    })
  );
}


  login(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(() => {
        this.router.navigate(['/tabs/tabHome']);
        this.toastService.showSuccess('Inicio de sesión exitoso!');
      }),
      map(() => {}),
      catchError((error) => {
        this.toastService.showError(this.getFirebaseErrorMessage(error.code));
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        localStorage.clear();
        this.router.navigate(['/login']);
        this.toastService.showSuccess('Sesión cerrada correctamente');
      })
    );
  }

  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El email ya está registrado';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      default:
        return 'Error desconocido';
    }
  }
}
