import { inject } from "@angular/core";
import { Injectable } from "@angular/core";
import { ApiService } from "@core/service/api.service";
import { User } from "../../auth/dto/loginResponse.interface";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly endpoint = 'users';
    private apiService = inject(ApiService);

    getProfile(): Observable<User> {
        const token = localStorage.getItem('AuthToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.apiService.get<User>(this.endpoint + '/profile', { headers });
    }
}
