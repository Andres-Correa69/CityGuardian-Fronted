import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl: string = environments.API_URL;

  constructor() { }

  private handleError(error: HttpErrorResponse) {
    // Preservamos la estructura del error del servidor
    if (error.error && typeof error.error === 'object') {
      return throwError(() => error.error);
    }

    // Si no hay estructura específica, creamos un mensaje de error
    const errorMessage = error.error?.message || error.message || 'Error en la petición';
    return throwError(() => ({
      error: true,
      message: errorMessage,
      status: error.status
    }));
  }

  get<T>(endpoint: string, options: { params?: any, headers?: HttpHeaders } = {}) {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, body: any, options: any = {}) {
    const requestOptions = {
      ...options,
      headers: options.headers || new HttpHeaders()
    };

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, requestOptions)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }

  postFormData<T>(endpoint: string, body: any, options: any = {}) {
    console.log('URL de la petición:', `${this.baseUrl}${endpoint}`);
    console.log('Headers en la petición:', options.headers);
    console.log('Body de la petición:', body);

    // Si es FormData, no establecemos Content-Type
    if (body instanceof FormData) {
      return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options)
        .pipe(
          map(response => response as T),
          catchError(this.handleError)
        );
    }

    // Para otros tipos de datos, establecemos el Content-Type por defecto
    const defaultOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...options.headers
      })
    };

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, defaultOptions)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, body: any, options: any = {}) {
    const requestOptions = {
      ...options,
      headers: options.headers || new HttpHeaders()
    };

    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, requestOptions)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string, options: any = {}) {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }
}
