import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';
import { ILoginResponse } from '../dto/loginResponse.interface';
import { ILoginRequest } from '../dto/LoginRequest.interface';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiService = inject(ApiService);
  private readonly prefix = 'auth';
  constructor() { }

  login(loginRequest: ILoginRequest) : Observable<ILoginResponse>  {
    return this.apiService.post(`${this.prefix}/login`, loginRequest);
  }

  getUser(id: string) : Observable<any> {
    return this.apiService.get(`${this.prefix}/usuarios/${id}`);
  }

  getUserByEmail(email: string) {
    return this.apiService.get(`${this.prefix}/usuarios/email/${email}`);
  }

  getUserByUsername(username: string) {
    return this.apiService.get(`${this.prefix}/usuarios/username/${username}`);
  }
}