import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProductDto } from '../models/api.models';

export interface ProductUpsertPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  weightInGrams?: number | null;
  packageCount?: number | null;
  isActive: boolean;
  brandId: string;
  image?: File | null;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly url = `${environment.apiBaseUrl}/api/Products`;

  constructor(private http: HttpClient) {}

  /** Public site: active products only */
  getAll(brandId?: string | null): Observable<ProductDto[]> {
    return this.getAllRaw(brandId).pipe(
      map((products) => products.filter((product) => product.isActive))
    );
  }

  /** Dashboard: all products including inactive */
  getAllAdmin(brandId?: string | null): Observable<ProductDto[]> {
    return this.getAllRaw(brandId);
  }

  getById(id: string): Observable<ProductDto> {
    return this.http
      .get<ApiResponse<ProductDto>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: ProductUpsertPayload): Observable<ProductDto> {
    return this.http
      .post<ApiResponse<ProductDto>>(this.url, this.toFormData(payload))
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to create product');
          }
          return res.data;
        })
      );
  }

  update(id: string, payload: ProductUpsertPayload): Observable<ProductDto> {
    return this.http
      .put<ApiResponse<ProductDto>>(`${this.url}/${id}`, this.toFormData(payload))
      .pipe(
        map((res) => {
          if (!res?.success || !res.data) {
            throw new Error(res?.message || 'Failed to update product');
          }
          return res.data;
        })
      );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }

  private getAllRaw(brandId?: string | null): Observable<ProductDto[]> {
    let params = new HttpParams();
    if (brandId) {
      params = params.set('brandId', brandId).set('BrandId', brandId);
    }

    return this.http.get<ApiResponse<ProductDto[]>>(this.url, { params }).pipe(
      map((res) => {
        const products = res.data ?? [];
        if (!brandId) return products;
        const id = String(brandId);
        return products.filter((product) => {
          const productBrand = String(
            product.brandId ?? (product as { BrandId?: string }).BrandId ?? ''
          );
          return productBrand === id;
        });
      })
    );
  }

  private toFormData(payload: ProductUpsertPayload): FormData {
    const form = new FormData();
    form.append('NameAr', payload.nameAr);
    form.append('NameEn', payload.nameEn);
    form.append('DescriptionAr', payload.descriptionAr ?? '');
    form.append('DescriptionEn', payload.descriptionEn ?? '');
    form.append('WeightInGrams', String(payload.weightInGrams ?? 0));
    form.append('PackageCount', String(payload.packageCount ?? 0));
    form.append('IsActive', String(payload.isActive));
    form.append('BrandId', payload.brandId);
    if (payload.image) {
      form.append('Image', payload.image, payload.image.name);
    }
    return form;
  }
}
