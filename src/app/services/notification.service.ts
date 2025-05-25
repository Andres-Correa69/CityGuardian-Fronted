import { Injectable, inject } from '@angular/core';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environments } from '../../environments/environments';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging: any;
  public currentMessage = new BehaviorSubject<any>(null);
  private toastService = inject(ToastService);
  private http = inject(HttpClient);

  constructor() {
    const app = initializeApp(environments.firebase as FirebaseOptions);
    this.messaging = getMessaging(app);
    this.initializeFCM();
    this.listenToMessages();
  }

  private async initializeFCM() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.getAndSaveToken();
      } else {
        console.log('Permiso de notificaciones denegado');
      }
    } catch (error) {
      console.error('Error al inicializar FCM:', error);
    }
  }

  private async getAndSaveToken() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: environments.vapidKey
      });
      
      if (token) {
        console.log('Token FCM obtenido:', token);
        // Guardar el token en el localStorage
        localStorage.setItem('fcm_token', token);
        
        // Enviar el token a tu backend
        //await this.saveTokenToBackend(token);
      }
    } catch (error) {
      console.error('Error al obtener el token FCM:', error);
    }
  }

  private async saveTokenToBackend(token: string) {
    try {
      // Ajusta la URL según tu backend
      await this.http.post(`${environments.API_URL}notifications/token`, {
        token: token,
        userId: localStorage.getItem('userId') // Ajusta según tu sistema de autenticación
      }).toPromise();
    } catch (error) {
      console.error('Error al guardar el token en el backend:', error);
    }
  }

  // Método para actualizar el token si es necesario
  async updateToken() {
    await this.getAndSaveToken();
  }

  // Método para eliminar el token (por ejemplo, al cerrar sesión)
  async deleteToken() {
    try {
      await this.messaging.deleteToken();
      localStorage.removeItem('fcm_token');
    } catch (error) {
      console.error('Error al eliminar el token:', error);
    }
  }

  listenToMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido:', payload);
      this.currentMessage.next(payload);
      
      if (payload.notification) {
        // Asegurarnos de que los valores no sean undefined
        const title = payload.notification.title || 'Notificación';
        const body = payload.notification.body || 'Nueva notificación';
        
        console.log('Mostrando toast con:', { title, body });
        // Usar setTimeout para asegurarnos de que el toast se muestre en el siguiente ciclo
        setTimeout(() => {
          this.toastService.info(body, title);
        }, 0);
      }
    });
  }
} 