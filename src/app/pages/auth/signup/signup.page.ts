import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonInput, IonButton, IonIcon, IonText
} from '@ionic/angular/standalone';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonItem, IonInput,
    IonButton, IonIcon, IonText
  ]
})
export class SignupPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/login']);
    }
  }

  register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      error: (err) => {
        console.error('Error en registro:', err);
      }
    });
  }
}
