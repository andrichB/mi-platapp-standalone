// auth.service.ts (refactor)
import { Injectable, inject } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, User
} from '@angular/fire/auth';
import { Observable, BehaviorSubject, from, catchError, map, throwError, switchMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private usuarioService = inject(UsuarioService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // 🔐 Registro con guardado en Firestore
  register(email: string, password: string, nombre: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => {
        const nuevoUsuario: Usuario = {
          uid: user.uid,
          email,
          nombre,
          fotoURL: user.photoURL ?? ''
        };
        return from(this.usuarioService.guardarUsuario(nuevoUsuario));
      }),
      map(() => {
        this.toastService.showSuccess('Registro exitoso!');
        this.router.navigate(['/tabs/tabHome']);
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
        this.toastService.showSuccess('Inicio de sesión exitoso!');
        this.router.navigate(['/tabs/tabHome']);
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
      case 'auth/email-already-in-use': return 'El email ya está registrado';
      case 'auth/invalid-email': return 'Email inválido';
      case 'auth/weak-password': return 'La contraseña es muy débil';
      case 'auth/user-not-found': return 'Usuario no encontrado';
      case 'auth/wrong-password': return 'Contraseña incorrecta';
      default: return 'Error desconocido';
    }
  }

  //Cosa experimental que se supone que permite tener acceso al perfil completo, no solo al User de Firebase
  public usuarioFirestore$ = this.currentUser$.pipe(
    switchMap(user => user ? this.usuarioService.obtenerUsuario(user.uid) : of(null))
  );
}
