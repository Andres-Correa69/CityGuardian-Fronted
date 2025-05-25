import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `,
})
export class AppComponent {
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);

  constructor() {
    this.notificationService.listenToMessages();
  }

  testToast() {
    this.toastService.info('Este es un mensaje de prueba', 'Título de prueba');
  }

  title = 'city-guardian';
}
