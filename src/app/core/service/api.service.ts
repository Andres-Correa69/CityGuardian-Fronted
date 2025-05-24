import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl: string = environments.API_URL;

  constructor() {}

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

  get<T>(endpoint: string, params?: any) {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(catchError(this.handleError));
  }
}
