import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProductDto, ProductUnitDto } from '../models/api.models';

export interface ProductUpsertPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  quantity: number;
  unit: number;
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

  getUnits(): Observable<ProductUnitDto[]> {
    return this.http
      .get<ApiResponse<ProductUnitDto[]>>(`${this.url}/units`)
      .pipe(map((res) => res.data ?? []));
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
        map((res) => this.unwrap(res, 'تعذر إضافة المنتج.')),
        catchError((err) => throwError(() => this.toError(err, 'تعذر إضافة المنتج.')))
      );
  }

  update(id: string, payload: ProductUpsertPayload): Observable<ProductDto> {
    return this.http
      .put<ApiResponse<ProductDto>>(`${this.url}/${id}`, this.toFormData(payload))
      .pipe(
        map((res) => this.unwrap(res, 'تعذر حفظ تعديلات المنتج.')),
        catchError((err) => throwError(() => this.toError(err, 'تعذر حفظ تعديلات المنتج.')))
      );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }

  private unwrap(res: ApiResponse<ProductDto>, fallback: string): ProductDto {
    if (!res?.success || !res.data) {
      throw this.toError({ error: res }, fallback);
    }
    return res.data;
  }

  private toError(err: unknown, fallback: string): Error {
    return new Error(this.readBackendMessage(err) || fallback);
  }

  private readBackendMessage(err: unknown): string {
    const body =
      err instanceof HttpErrorResponse
        ? err.error
        : (err as { error?: unknown })?.error ?? err;

    if (!body) return '';
    if (typeof body === 'string') {
      const text = body.trim();
      return text && text !== '[object Object]' ? text : '';
    }
    if (typeof body !== 'object') return '';

    const obj = body as {
      message?: string | null;
      Message?: string | null;
      title?: string | null;
      errors?: string[] | Record<string, string[] | string> | null;
      Errors?: string[] | Record<string, string[] | string> | null;
    };

    const message = (obj.message || obj.Message || obj.title || '').trim();
    const errors = obj.errors ?? obj.Errors;

    if (Array.isArray(errors) && errors.length) {
      const list = errors.map(String).filter(Boolean);
      if (list.length) return message ? `${message}: ${list.join(' · ')}` : list.join(' · ');
    }

    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
      const list = Object.entries(errors).flatMap(([key, value]) => {
        const msgs = Array.isArray(value) ? value : [value];
        return msgs
          .map(String)
          .filter(Boolean)
          .map((msg) => (key ? `${key}: ${msg}` : msg));
      });
      if (list.length) return message ? `${message}: ${list.join(' · ')}` : list.join(' · ');
    }

    return message;
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
    form.append('Quantity', String(payload.quantity ?? 0));
    form.append('Unit', String(payload.unit));
    form.append('PackageCount', String(payload.packageCount ?? 0));
    form.append('IsActive', String(payload.isActive));
    form.append('BrandId', payload.brandId);
    if (payload.image) {
      form.append('Image', payload.image, payload.image.name);
    }
    return form;
  }
}
