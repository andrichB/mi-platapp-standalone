import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonInput, IonButton, IonText, IonIcon, IonSpinner 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { ToastService } from '../../../services/toast.service'; // Opcional pero recomendado
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  mailOutline, 
  lockClosedOutline 
} from 'ionicons/icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonInput, IonButton, IonText, IonIcon, IonSpinner
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loading: boolean = false;
 
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService); // Opcional
  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }
  // En tu login.page.ts
  async login() {
    if (!this.email || !this.password) {
      this.toastService.showError('Por favor complete todos los campos');
      return;
    }

    this.loading = true;
    
    try {
      await firstValueFrom(this.authService.login(this.email, this.password));
      // La navegación ahora se maneja en el servicio
    } catch (error) {
      // Los errores ya los maneja el AuthService
      console.error('Error en el componente:', error);
    } finally {
      this.loading = false;
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}