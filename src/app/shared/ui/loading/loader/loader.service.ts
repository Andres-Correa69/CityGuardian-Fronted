import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  /**
   * Muestra el indicador de carga
   */
  showLoading(): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'flex';
    }
  }

  /**
   * Oculta el indicador de carga
   */
  hideLoading(): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}
