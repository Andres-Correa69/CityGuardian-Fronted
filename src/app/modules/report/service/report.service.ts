import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';
import { Category } from '../../category/service/category.service';
import { IReportResponse } from '../dto/reportResponse.interface';

export interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  category: Category;
  imageUrls: string[];
  location: {
    latitude: number;
    longitude: number;
  } | null;
  important?: boolean;
}

export interface ReportRequest {
  title: string;
  description: string;
  categoryId: string;
  status: string;
  imageUrls: string[];
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly endpoint = 'reports';
  private readonly categoryEndpoint = 'categories';
  private apiService = inject(ApiService);

  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.categoryEndpoint);
  }

  createReport(report: ReportRequest, images: File[]): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const formData = new FormData();

    // Convertimos el report a Blob para asegurar el tipo correcto
    const reportBlob = new Blob([JSON.stringify(report)], { type: 'application/json' });
    formData.append('report', reportBlob, 'report.json');

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        // Aseguramos que el archivo mantenga su tipo MIME original
        formData.append('imagenes', image, image.name);
      });
    }

    // No establecemos ningún Content-Type, dejamos que el navegador lo maneje
    return this.apiService.postFormData<any>(`${this.endpoint}/create`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getReports(): Observable<Report[]> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.apiService.get<Report[]>(this.endpoint, { headers });
  }

  getReportById(id: string): Observable<IReportResponse> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.get<IReportResponse>(`${this.endpoint}/${id}`, { headers });
  }

  verifyReport(id: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.patch(`${this.endpoint}/${id}/verify`, {}, { headers });
  }

  getReportesCercanos(latitud: number, longitud: number): Observable<Report[]> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.get<Report[]>(
      `${this.endpoint}/nearby?latitud=${latitud}&longitud=${longitud}`,
      { headers }
    );
  }


  rejectReport(id: string, rejectReason: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.patch(`${this.endpoint}/${id}/reject?rejectReason=${encodeURIComponent(rejectReason)}`, {}, { headers });
  }

  resolveReport(id: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.patch(`${this.endpoint}/${id}/resolve`, {}, { headers });
  }

  reviewReport(id: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.patch(`${this.endpoint}/${id}/review`, {}, { headers });
  }

  markAsImportant(reportId: string, important: boolean = true): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const endpoint = important
      ? `${this.endpoint}/${reportId}/important`
      : `${this.endpoint}/${reportId}/NotImportant`;

    return this.apiService.put<any>(endpoint, { important }, { headers });
  }

  updateReport(id: string, report: ReportRequest, images: File[]): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const formData = new FormData();

    // Convertimos el report a Blob para asegurar el tipo correcto
    const reportBlob = new Blob([JSON.stringify(report)], { type: 'application/json' });
    formData.append('report', reportBlob, 'report.json');

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        // Aseguramos que el archivo mantenga su tipo MIME original
        formData.append('imagenes', image, image.name);
      });
    }

    // No establecemos ningún Content-Type, dejamos que el navegador lo maneje
    return this.apiService.putFormData<any>(`${this.endpoint}/${id}`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
