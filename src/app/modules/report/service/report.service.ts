import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';
import { environments } from 'src/environments/environments';

export interface Report {
  title: string;
  description: string;
  status: string;
  categoryId: string;
  imageUrls: string[];
  location: {
    latitude: string;
    longitude: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly endpoint = '/reports';
  private apiService = inject(ApiService);

  createReport(report: Report, images: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('report', JSON.stringify(report));
    
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('imagenes', image);
      });
    }

    return this.apiService.post<any>(`${this.endpoint}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getReports(): Observable<Report[]> {
    return this.apiService.get<Report[]>(this.endpoint);
  }
}
