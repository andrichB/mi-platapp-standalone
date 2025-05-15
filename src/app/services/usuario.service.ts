import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly usuariosCollection;

  constructor(private readonly firestore: Firestore) {
    this.usuariosCollection = collection(this.firestore, 'usuarios');
  }

  // 📌 Crear o actualizar un usuario con ID personalizado (UID)
  async guardarUsuario(usuario: Usuario): Promise<void> {
    const usuarioDoc = doc(this.firestore, `usuarios/${usuario.uid}`);
    await setDoc(usuarioDoc, usuario, { merge: true });
  }

  // 📌 Obtener todos los usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    return collectionData(this.usuariosCollection, { idField: 'uid' }).pipe(
      map(data => data as Usuario[])
    );
  }

  // 📌 Obtener usuario por ID (UID)
  obtenerUsuario(uid: string): Observable<Usuario | null> {
    const usuarioDoc = doc(this.firestore, `usuarios/${uid}`);
    return new Observable<Usuario | null>(observer => {
      getDoc(usuarioDoc).then(snapshot => {
        if (snapshot.exists()) {
          observer.next({ uid, ...snapshot.data() } as Usuario);
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  // 📌 Obtener usuario por email
  obtenerUsuarioPorEmail(email: string): Observable<Usuario | null> {
    return collectionData(this.usuariosCollection, { idField: 'uid' }).pipe(
      map(usuarios => {
        const usuario = usuarios.find(u => (u as Usuario).email === email);
        return usuario ? usuario as Usuario : null;
      })
    );
  }

  // 📌 Actualizar usuario parcialmente
  async actualizarUsuario(uid: string, datos: Partial<Usuario>): Promise<void> {
    const usuarioDoc = doc(this.firestore, `usuarios/${uid}`);
    await updateDoc(usuarioDoc, datos);
  }

  // 📌 Eliminar usuario
  async eliminarUsuario(uid: string): Promise<void> {
    const usuarioDoc = doc(this.firestore, `usuarios/${uid}`);
    await deleteDoc(usuarioDoc);
  }
}
