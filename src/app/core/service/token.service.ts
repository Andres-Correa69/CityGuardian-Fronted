import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = "AuthToken";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { } 

  public setToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
   }

   public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
   }

   public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
   }

   public clearToken() {
    localStorage.removeItem(TOKEN_KEY);
   }

   private decodePayload(token: string): any {
    const payload = token!.split(".")[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(base64);
    return JSON.parse(decodedPayload);
   }

   public getPayload(): any {
    const token = this.getToken();
    if (token) {
      return this.decodePayload(token);
    }
    return null;
   }
   
   
   
   
}
