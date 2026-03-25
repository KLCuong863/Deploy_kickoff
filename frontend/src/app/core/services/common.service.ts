import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/common`;

  getRoles(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/roles`).pipe(
      map(res => res.data)
    );
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/departments`).pipe(
      map(res => res.data)
    );
  }

  getPermissions(roleId: number): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/permissions/${roleId}`).pipe(
      map(res => res.data)
    );
  }
}
