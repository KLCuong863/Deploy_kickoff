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
}
