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
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => response as T),
        catchError(this.handleError)
      );
  }
}
