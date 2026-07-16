import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  ContactMessageDto,
  CreateContactMessageRequest,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ContactMessagesService {
  private readonly url = `${environment.apiBaseUrl}/api/ContactMessages`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContactMessageDto[]> {
    return this.http
      .get<ApiResponse<ContactMessageDto[]>>(this.url)
      .pipe(map((res) => res.data ?? []));
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.url}/unread-count`)
      .pipe(map((res) => res.data ?? 0));
  }

  send(payload: CreateContactMessageRequest): Observable<ContactMessageDto> {
    return this.http.post<ApiResponse<ContactMessageDto>>(this.url, payload).pipe(
      map((res) => {
        if (!res?.success || !res.data) {
          throw new Error(res?.message || 'Failed to send contact message');
        }
        return res.data;
      })
    );
  }

  markRead(id: string): Observable<unknown> {
    return this.http.patch<ApiResponse<unknown>>(`${this.url}/${id}/read`, {});
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }
}
