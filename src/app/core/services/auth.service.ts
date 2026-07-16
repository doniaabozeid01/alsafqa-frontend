import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  ChangePasswordRequest,
  LoginData,
  LoginRequest,
} from '../models/api.models';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface StoredSession {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

const STORAGE_KEY = 'alsafqa_admin_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/Auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<{ ok: boolean; message?: string }> {
    const payload: LoginRequest = {
      email: email.trim(),
      password,
    };

    return this.http.post<ApiResponse<LoginData>>(`${this.baseUrl}/login`, payload).pipe(
      map((res) => {
        if (!res?.success || !res.data?.token || !res.data.user) {
          return {
            ok: false,
            message: res?.message || 'تعذر تسجيل الدخول',
          };
        }

        this.persistSession(res.data);
        return { ok: true };
      }),
      catchError(() =>
        of({
          ok: false,
          message: 'تعذر الاتصال بالسيرفر. تأكد أن الـ API يعمل ثم حاول مرة أخرى.',
        })
      )
    );
  }

  changePassword(
    payload: ChangePasswordRequest
  ): Observable<{ ok: boolean; message?: string }> {
    return this.http
      .post<ApiResponse<unknown>>(`${this.baseUrl}/change-password`, payload)
      .pipe(
        map((res) => {
          if (!res?.success) {
            return {
              ok: false,
              message: res?.message || 'تعذر تغيير كلمة المرور',
            };
          }
          return {
            ok: true,
            message: res.message || 'تم تحديث كلمة المرور بنجاح',
          };
        }),
        catchError((err) =>
          of({
            ok: false,
            message:
              err?.error?.message ||
              'تعذر تغيير كلمة المرور. تحقق من كلمة المرور الحالية وحاول مرة أخرى.',
          })
        )
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const session = this.readSession();
    if (!session?.token) return false;
    if (this.isExpired(session.expiresAt)) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return true;
  }

  getToken(): string | null {
    if (!this.isLoggedIn()) return null;
    return this.readSession()?.token ?? null;
  }

  getUser(): AuthUser | null {
    if (!this.isLoggedIn()) return null;
    return this.readSession()?.user ?? null;
  }

  private persistSession(data: LoginData): void {
    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.fullName || 'مدير',
    };

    const session: StoredSession = {
      token: data.token,
      expiresAt: data.expiresAt,
      user,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private readSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  }

  private isExpired(expiresAt: string): boolean {
    const end = Date.parse(expiresAt);
    if (Number.isNaN(end)) return false;
    return Date.now() >= end;
  }
}
