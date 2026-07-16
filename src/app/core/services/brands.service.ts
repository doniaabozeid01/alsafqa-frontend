import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, BrandDto } from '../models/api.models';

export interface BrandUpsertPayload {
  nameAr: string;
  nameEn: string;
  isActive: boolean;
  image?: File | null;
}

@Injectable({ providedIn: 'root' })
export class BrandsService {
  private readonly url = `${environment.apiBaseUrl}/api/Brands`;

  constructor(private http: HttpClient) {}

  /** Public site: active brands only */
  getAll(): Observable<BrandDto[]> {
    return this.getAllRaw().pipe(
      map((brands) => brands.filter((brand) => brand.isActive))
    );
  }

  /** Dashboard: all brands including inactive */
  getAllAdmin(): Observable<BrandDto[]> {
    return this.getAllRaw();
  }

  getById(id: string): Observable<BrandDto> {
    return this.http
      .get<ApiResponse<BrandDto>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: BrandUpsertPayload): Observable<BrandDto> {
    return this.http
      .post<ApiResponse<BrandDto>>(this.url, this.toFormData(payload))
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to create brand');
          }
          return res.data;
        })
      );
  }

  update(id: string, payload: BrandUpsertPayload): Observable<BrandDto> {
    return this.http
      .put<ApiResponse<BrandDto>>(`${this.url}/${id}`, this.toFormData(payload))
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to update brand');
          }
          return res.data;
        })
      );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }

  private getAllRaw(): Observable<BrandDto[]> {
    return this.http
      .get<ApiResponse<BrandDto[]>>(this.url)
      .pipe(map((res) => res.data ?? []));
  }

  private toFormData(payload: BrandUpsertPayload): FormData {
    const form = new FormData();
    form.append('NameAr', payload.nameAr);
    form.append('NameEn', payload.nameEn);
    form.append('IsActive', String(payload.isActive));
    if (payload.image) {
      form.append('Image', payload.image, payload.image.name);
    }
    return form;
  }
}
