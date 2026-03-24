import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  VuViec,
  CreateVuViecRequest,
  UpdateVuViecRequest,
  ChangeStatusRequest,
  VuViecSearchRequest,
  VuViecStatusLog,
  VuViecFile,
  DanhMucLoaiVuViec,
  Department,
} from '../models/vu-viec.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class VuViecService {
  private apiUrl = `${environment.apiUrl}/api/vu-viec`;
  private commonUrl = `${environment.apiUrl}/api/v1/common`;

  constructor(private http: HttpClient) {}

  search(req?: VuViecSearchRequest): Observable<PageResponse<VuViec>> {
    let params = new HttpParams();
    if (req?.search) params = params.set('search', req.search);
    if (req?.loai) params = params.set('loai', req.loai);
    if (req?.mucDo) params = params.set('mucDo', req.mucDo);
    if (req?.trangThai) params = params.set('trangThai', req.trangThai);
    if (req?.page !== undefined) params = params.set('page', String(req.page));
    if (req?.limit !== undefined) params = params.set('limit', String(req.limit));
    return this.http
      .get<ApiResponse<PageResponse<VuViec>>>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<VuViec> {
    return this.http
      .get<ApiResponse<VuViec>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(request: CreateVuViecRequest): Observable<VuViec> {
    return this.http
      .post<ApiResponse<VuViec>>(this.apiUrl, request)
      .pipe(map((res) => res.data));
  }

  update(id: string, request: UpdateVuViecRequest): Observable<VuViec> {
    return this.http
      .put<ApiResponse<VuViec>>(`${this.apiUrl}/${id}`, request)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  changeStatus(id: string, request: ChangeStatusRequest): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.apiUrl}/${id}/trang-thai`, request)
      .pipe(map(() => void 0));
  }

  getStatusLogs(id: string): Observable<VuViecStatusLog[]> {
    return this.http
      .get<ApiResponse<VuViecStatusLog[]>>(`${this.apiUrl}/${id}/trang-thai-log`)
      .pipe(map((res) => res.data));
  }

  uploadFiles(id: string, files: File[]): Observable<VuViecFile[]> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return this.http
      .post<ApiResponse<VuViecFile[]>>(`${this.apiUrl}/${id}/files`, formData)
      .pipe(map((res) => res.data));
  }

  deleteFile(vuViecId: string, fileId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${vuViecId}/files/${fileId}`)
      .pipe(map(() => void 0));
  }

  getLoaiVuViec(): Observable<DanhMucLoaiVuViec[]> {
    return this.http
      .get<ApiResponse<DanhMucLoaiVuViec[]>>(`${this.commonUrl}/loai-vu-viec`)
      .pipe(map((res) => res.data));
  }

  getDepartments(): Observable<Department[]> {
    return this.http
      .get<ApiResponse<Department[]>>(`${this.commonUrl}/departments`)
      .pipe(map((res) => res.data));
  }
}
