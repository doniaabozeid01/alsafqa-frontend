import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, GalleryDto } from '../models/api.models';

export interface GalleryUpsertPayload {
  titleAr: string;
  titleEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  isActive: boolean;
  galleryCategoryId: string;
  image?: File | null;
}

@Injectable({ providedIn: 'root' })
export class GalleriesService {
  private readonly url = `${environment.apiBaseUrl}/api/Galleries`;

  constructor(private http: HttpClient) {}

  getAll(galleryCategoryId?: string | null): Observable<GalleryDto[]> {
    return this.getAllRaw(galleryCategoryId).pipe(
      map((items) => items.filter((item) => item.isActive))
    );
  }

  getAllAdmin(galleryCategoryId?: string | null): Observable<GalleryDto[]> {
    return this.getAllRaw(galleryCategoryId);
  }

  create(payload: GalleryUpsertPayload): Observable<GalleryDto> {
    return this.http
      .post<ApiResponse<GalleryDto>>(this.url, this.toFormData(payload))
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to create gallery item');
          }
          return res.data;
        })
      );
  }

  update(id: string, payload: GalleryUpsertPayload): Observable<GalleryDto> {
    return this.http
      .put<ApiResponse<GalleryDto>>(`${this.url}/${id}`, this.toFormData(payload))
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to update gallery item');
          }
          return res.data;
        })
      );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }

  private getAllRaw(galleryCategoryId?: string | null): Observable<GalleryDto[]> {
    let params = new HttpParams();
    if (galleryCategoryId) {
      params = params.set('galleryCategoryId', galleryCategoryId);
    }

    return this.http
      .get<ApiResponse<GalleryDto[]>>(this.url, { params })
      .pipe(map((res) => res.data ?? []));
  }

  private toFormData(payload: GalleryUpsertPayload): FormData {
    const form = new FormData();
    form.append('TitleAr', payload.titleAr);
    form.append('TitleEn', payload.titleEn);
    form.append('DescriptionAr', payload.descriptionAr ?? '');
    form.append('DescriptionEn', payload.descriptionEn ?? '');
    form.append('IsActive', String(payload.isActive));
    form.append('GalleryCategoryId', payload.galleryCategoryId);
    if (payload.image) {
      form.append('Image', payload.image, payload.image.name);
    }
    return form;
  }
}
