import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, GalleryCategoryDto } from '../models/api.models';

export interface GalleryCategoryUpsertPayload {
  nameAr: string;
  nameEn: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class GalleryCategoriesService {
  private readonly url = `${environment.apiBaseUrl}/api/GalleryCategories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GalleryCategoryDto[]> {
    return this.getAllRaw().pipe(
      map((items) => items.filter((item) => item.isActive))
    );
  }

  getAllAdmin(): Observable<GalleryCategoryDto[]> {
    return this.getAllRaw();
  }

  create(payload: GalleryCategoryUpsertPayload): Observable<GalleryCategoryDto> {
    return this.http
      .post<ApiResponse<GalleryCategoryDto>>(this.url, payload)
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to create gallery category');
          }
          return res.data;
        })
      );
  }

  update(
    id: string,
    payload: GalleryCategoryUpsertPayload
  ): Observable<GalleryCategoryDto> {
    return this.http
      .put<ApiResponse<GalleryCategoryDto>>(`${this.url}/${id}`, payload)
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to update gallery category');
          }
          return res.data;
        })
      );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }

  private getAllRaw(): Observable<GalleryCategoryDto[]> {
    return this.http
      .get<ApiResponse<GalleryCategoryDto[]>>(this.url)
      .pipe(map((res) => res.data ?? []));
  }
}
