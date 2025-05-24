import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';
import { environments } from 'src/environments/environments';
import { Category } from '../../category/service/category.service';

export interface Report {
  title: string;
  description: string;
  status: string;
  categoryId: string;
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
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const formData = new FormData();
    formData.append('report', JSON.stringify(report));

    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('imagenes', image);
      });
    }

    return this.apiService.post<any>(`${this.endpoint}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getReports(): Observable<Report[]> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.apiService.get<Report[]>(this.endpoint, { headers });
  }
}
