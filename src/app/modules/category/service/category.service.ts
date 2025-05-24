import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';

export interface Category {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly endpoint = '/categories';
  private apiService = inject(ApiService);

  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.endpoint);
  }

  createCategory(category: Category): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, category);
  }
} 