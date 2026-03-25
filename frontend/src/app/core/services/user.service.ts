import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(this.apiUrl, {
      headers: { 'Cache-Control': 'no-cache' }
    }).pipe(
      map(response => response.data)
    );
  }

  getById(id: any): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(user: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, user).pipe(
      map(response => response.data)
    );
  }

  update(id: any, user: any): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, user).pipe(
      map(response => response.data)
    );
  }

  delete(id: any): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
}
