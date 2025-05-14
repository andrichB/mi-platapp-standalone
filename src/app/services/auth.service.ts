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
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, authState } from '@angular/fire/auth';
import { Observable, BehaviorSubject, map, catchError, throwError, from } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service'; // Servicio opcional para feedback

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService); // Opcional
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserSubject.next(user);
    });
  }

  register(email: string, password: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => {
        this.router.navigate(['/home']); // Redirige tras registro
      }),
      catchError((error) => {
        this.toastService.showError('Error en registro: ' + error.message); // Feedback visual
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => {
        this.router.navigate(['/home']); // Redirige tras login
      }),
      catchError((error) => {
        this.toastService.showError('Email o contraseña incorrectos'); // Feedback visual
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.router.navigate(['/login']); // Redirige tras logout
      this.currentUserSubject.next(null); // Limpia el estado
      this.toastService.showSuccess('Sesión cerrada'); // Opcional
      localStorage.clear(); // Limpia storage si usas datos locales
      sessionStorage.clear();
      })
    );
  }
}