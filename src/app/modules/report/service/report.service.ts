import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';
import { environments } from 'src/environments/environments';
import { Category } from '../../category/service/category.service';

export interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  category: Category;
  imageUrls: string[];
  location: {
    latitude: string;
    longitude: string;
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

  createReport(report: Report, images: File[]): Observable<any> {
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
    return this.apiService.post<any>(`${this.endpoint}/create`, formData, {
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

  getReportById(id: string): Observable<Report> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.apiService.get<Report>(`${this.endpoint}/${id}`, { headers });
  }
}
