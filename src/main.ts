import { bootstrapApplication } from '@angular/platform-browser';
import { 
  RouteReuseStrategy, 
  provideRouter, 
  withPreloading, 
  PreloadAllModules 
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

//Register
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    // Configuración de Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    
    // Configuración de Rutas
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Configuración de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    // Configuración de Firestore Register
    provideFirestore(() => getFirestore())
  ],
}).catch(err => console.error(err));