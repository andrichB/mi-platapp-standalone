import { Component, ViewChild, OnInit } from '@angular/core';
import { IonModal, IonInput, IonSelect, IonSelectOption, IonButtons, IonButton } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; 
import { ToastService } from '../../services/toast.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('categoryModal') categoryModal!: IonModal;

  // Datos de las categorías personalizadas
  customCategories$ = new BehaviorSubject<any[]>([]);  // Observable para las categorías
  newCategory = {
    name: '',
    icon: '🍔',
    color: '#FF5733'
  };

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Cargar las categorías personalizadas del usuario
  loadCategories() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const categoriasRef = collection(this.firestore, `categorias`);
      // Filtro para las categorías del usuario actual
      this.firestore.collection(categoriasRef, ref => ref.where('usuarioId', '==', user.uid))
        .valueChanges().subscribe(categories => {
          this.customCategories$.next(categories);
        });
    }
  }

  // Abrir modal para agregar categoría
  openCategoryModal() {
    this.categoryModal.present();
  }

  // Crear nueva categoría
  async createCategory() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const categoriasRef = collection(this.firestore, 'categorias');
    try {
      await addDoc(categoriasRef, {
        usuarioId: user.uid,
        nombre: this.newCategory.name,
        icono: this.newCategory.icon,
        color: this.newCategory.color
      });

      this.toastService.showSuccess('Categoría creada con éxito');
      this.categoryModal.dismiss();
      this.loadCategories();  // Recargar categorías
    } catch (error) {
      this.toastService.showError('Error al crear categoría');
      console.error(error);
    }
  }

  // Validar formulario de categoría
  isCategoryFormValid(): boolean {
    return this.newCategory.name.trim().length > 0;
  }
}
