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

  async login() {
    if (!this.email || !this.password) {
      this.toastService.showError('Por favor, completa todos los campos');
      return;
    }

    this.loading = true;
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']); // Redirige al home tras login exitoso
    } catch (error) {
      this.toastService.showError('Email o contraseña incorrectos');
      console.error('Error en login:', error);
    } finally {
      this.loading = false;
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}