import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;

  login(request: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/login`, request);
  }

  register(request: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register`, request);
  }

  saveSession(data: any, rememberMe: boolean = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', data.token);
    storage.setItem('currentUser', JSON.stringify(data));
    // Also save a flag to know which storage was used for logout/lookup
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser() {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
  }
}
