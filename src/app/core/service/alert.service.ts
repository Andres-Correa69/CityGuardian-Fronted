import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // Alerta de éxito
  success(title: string, message: string = '') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#5c8ecf'
    });
  }

  // Alerta de error
  error(title: string, message: string = '') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#5c8ecf'
    });
  }

  // Alerta de advertencia
  warning(title: string, message: string = '') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#5c8ecf'
    });
  }

  // Alerta de información
  info(title: string, message: string = '') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#5c8ecf'
    });
  }

  // Alerta de confirmación
  confirm(title: string, message: string = '') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#5c8ecf',
      cancelButtonColor: '#dc3545'
    });
  }

  // Alerta de carga
  loading(title: string = 'Cargando...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Cerrar alerta de carga
  close() {
    Swal.close();
  }

  // Alerta personalizada
  custom(options: any) {
    return Swal.fire({
      ...options,
      confirmButtonColor: '#5c8ecf'
    });
  }

  // Alerta de éxito con temporizador
  successTimer(title: string, message: string = '', timer: number = 2000) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      timer: timer,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  // Alerta de error con temporizador
  errorTimer(title: string, message: string = '', timer: number = 2000) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      timer: timer,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  // Alerta de confirmación con personalización
  confirmCustom(title: string, message: string = '', confirmButtonText: string = 'Sí', cancelButtonText: string = 'No') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: '#5c8ecf',
      cancelButtonColor: '#dc3545'
    });
  }

  // Alerta de éxito con redirección
  successRedirect(title: string, message: string, redirectUrl: string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#5c8ecf'
    }).then(() => {
      window.location.href = redirectUrl;
    });
  }
} 