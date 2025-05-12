import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  mailOutline, 
  lockClosedOutline 
} from 'ionicons/icons';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonText]
})
export class SignupPage implements OnInit {

  constructor(private location: Location, private router: Router) { 
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }

  ngOnInit() {
  }
goBack() {
  if (window.history.length > 1) {
    this.location.back();
  } else {
    this.router.navigate(['/login']); // Necesitarás inyectar Router
  }
}
}

