/* Configuracion default de Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}
*/
//Codigo proporcionado por Chat DeepSeek
import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, BehaviorSubject, from, catchError, map, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Escucha cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Registro con email y contraseña
  register(email: string, password: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => {
        this.toastService.showSuccess('Registro exitoso!');
        this.router.navigate(['/home']);
      }),
      catchError((error) => {
        this.toastService.showError(this.getFirebaseErrorMessage(error.code));
        return throwError(() => error);
      })
    );
  }

  // Inicio de sesión
  // En auth.service.ts
login(email: string, password: string): Observable<void> {
  return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
    tap(() => {
      this.router.navigate(['/tabs/tabHome']);
      this.toastService.showSuccess('Inicio de sesión exitoso!');
    }),
    map(() => {}), // Convertimos a Observable<void>
    catchError((error) => {
      this.toastService.showError(this.getFirebaseErrorMessage(error.code));
      return throwError(() => error);
    })
  );
}

  // Cierre de sesión
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

  // Método para traducir códigos de error de Firebase
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