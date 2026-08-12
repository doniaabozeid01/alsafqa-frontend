import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, TimeoutError, catchError, map, of, timeout } from 'rxjs';
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
/** Treat token as expired this many ms before actual expiry */
const EXPIRY_SKEW_MS = 15_000;

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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http
      .post<unknown>(`${this.baseUrl}/login`, payload, { headers })
      .pipe(
        timeout(60000),
        map((raw) => {
          const parsed = this.extractLoginData(raw, payload.email);
          if (!parsed.token) {
            return {
              ok: false,
              message: parsed.message || 'بيانات الدخول غير صحيحة',
            };
          }

          this.persistSession({
            token: parsed.token,
            expiresAt: parsed.expiresAt || this.defaultExpiry(),
            user: parsed.user,
          });

          if (!this.getValidSession()?.token) {
            const stored = this.readSession();
            if (!stored?.token) {
              return {
                ok: false,
                message:
                  'تعذر حفظ الجلسة في المتصفح. تأكد أن التخزين المحلي مسموح (Local Storage).',
              };
            }
            return {
              ok: false,
              message:
                'تم استلام توكن منتهي من السيرفر. حاول مرة أخرى أو راجع إعدادات التوكن في الباك.',
            };
          }

          return { ok: true };
        }),
        catchError((err: unknown) =>
          of({
            ok: false,
            message: this.loginErrorMessage(err),
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
        timeout(60000),
        map((res) => {
          const success =
            (res as { success?: boolean; Success?: boolean })?.success ??
            (res as { Success?: boolean })?.Success;
          if (success === false) {
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
        catchError((err: HttpErrorResponse) =>
          of({
            ok: false,
            message:
              err?.error?.message ||
              'تعذر تغيير كلمة المرور. تحقق من كلمة المرور الحالية وحاول مرة أخرى.',
          })
        )
      );
  }

  /** Clear any stored session without navigating (used on login page). */
  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }

  /**
   * Called when API returns 401 — session is invalid/expired.
   * Forces a fresh login so the user is not stuck with a dead token.
   */
  handleUnauthorized(): void {
    this.clearSession();
    if (!this.router.url.startsWith('/login')) {
      this.router.navigateByUrl('/login');
    }
  }

  /** Valid non-expired token only. Expired sessions are cleared automatically. */
  isLoggedIn(): boolean {
    return !!this.getValidSession()?.token;
  }

  getToken(): string | null {
    return this.getValidSession()?.token ?? null;
  }

  getUser(): AuthUser | null {
    return this.getValidSession()?.user ?? null;
  }

  private getValidSession(): StoredSession | null {
    const session = this.readSession();
    if (!session?.token) {
      return null;
    }

    if (this.isSessionExpired(session)) {
      this.clearSession();
      return null;
    }

    return session;
  }

  private isSessionExpired(session: StoredSession): boolean {
    const expiresMs = this.resolveExpiryMs(session);
    if (expiresMs == null) {
      // No usable expiry — keep token but interceptor 401 will clear it
      return false;
    }
    return expiresMs <= Date.now() + EXPIRY_SKEW_MS;
  }

  private resolveExpiryMs(session: StoredSession): number | null {
    const jwtMs = this.jwtExpiryMs(session.token);
    const storedMs = session.expiresAt ? Date.parse(session.expiresAt) : NaN;
    const storedOk = !Number.isNaN(storedMs);
    const now = Date.now() + EXPIRY_SKEW_MS;

    // If stored expiry is already past but JWT is still valid, trust the JWT
    if (storedOk && storedMs <= now && jwtMs != null && jwtMs > now) {
      return jwtMs;
    }
    if (storedOk) return storedMs;
    return jwtMs;
  }

  private jwtExpiryMs(token: string): number | null {
    try {
      const part = token.split('.')[1];
      if (!part) return null;
      const json = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
      if (!json?.exp) return null;
      return Number(json.exp) * 1000;
    } catch {
      return null;
    }
  }

  /** Never persist a past expiry — that immediately fails getValidSession(). */
  private pickFutureExpiry(token: string, serverExpiresAt: string): string {
    const now = Date.now() + EXPIRY_SKEW_MS;
    const jwtMs = this.jwtExpiryMs(token);
    if (jwtMs != null && jwtMs > now) {
      return new Date(jwtMs).toISOString();
    }

    const serverMs = Date.parse(serverExpiresAt);
    if (!Number.isNaN(serverMs) && serverMs > now) {
      return new Date(serverMs).toISOString();
    }

    return this.defaultExpiry();
  }

  private extractLoginData(
    raw: unknown,
    fallbackEmail: string
  ): { token: string; expiresAt: string; user: LoginData['user']; message?: string } {
    if (!raw || typeof raw !== 'object') {
      return { token: '', expiresAt: '', user: this.fallbackUser(fallbackEmail) };
    }

    const root = raw as Record<string, unknown>;
    const explicitFail = root['success'] === false || root['Success'] === false;
    const message = String(root['message'] ?? root['Message'] ?? '') || undefined;

    if (explicitFail) {
      return {
        token: '',
        expiresAt: '',
        user: this.fallbackUser(fallbackEmail),
        message: message || 'بيانات الدخول غير صحيحة',
      };
    }

    const data = (root['data'] ?? root['Data'] ?? root) as Record<string, unknown>;
    const token = String(
      data['token'] ?? data['Token'] ?? root['token'] ?? root['Token'] ?? ''
    ).trim();

    const serverExpiresAt = String(
      data['expiresAt'] ??
        data['ExpiresAt'] ??
        root['expiresAt'] ??
        root['ExpiresAt'] ??
        ''
    );

    const userRaw = (data['user'] ?? data['User'] ?? root['user'] ?? root['User']) as
      | Record<string, unknown>
      | null
      | undefined;

    const user = userRaw
      ? {
          id: String(userRaw['id'] ?? userRaw['Id'] ?? 'admin'),
          email: String(userRaw['email'] ?? userRaw['Email'] ?? fallbackEmail),
          fullName: String(userRaw['fullName'] ?? userRaw['FullName'] ?? 'Admin'),
        }
      : this.fallbackUser(fallbackEmail);

    const expiresAt = token ? this.pickFutureExpiry(token, serverExpiresAt) : '';

    return { token, expiresAt, user, message };
  }

  private fallbackUser(email: string): LoginData['user'] {
    return { id: 'admin', email, fullName: 'Admin' };
  }

  private defaultExpiry(): string {
    return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  }

  private loginErrorMessage(err: unknown): string {
    if (err instanceof TimeoutError) {
      return 'السيرفر أخذ وقت طويل. حاول مرة أخرى.';
    }

    const httpErr = err as HttpErrorResponse;
    const body = httpErr?.error;
    const apiMessage =
      (typeof body === 'string' ? body : null) ||
      body?.message ||
      body?.Message ||
      body?.title ||
      (Array.isArray(body?.errors) ? body.errors[0] : null);

    if (apiMessage) return String(apiMessage);

    if (httpErr?.status === 0) {
      return 'المتصفح منع طلب تسجيل الدخول (CORS على POST).';
    }
    if (httpErr?.status === 401 || httpErr?.status === 400) {
      return 'البريد أو كلمة المرور غير صحيحة';
    }
    if (httpErr?.status === 404) {
      return 'مسار تسجيل الدخول غير موجود على السيرفر.';
    }
    return 'تعذر تسجيل الدخول. حاول مرة أخرى.';
  }

  private persistSession(data: LoginData): void {
    const session: StoredSession = {
      token: data.token,
      expiresAt: this.pickFutureExpiry(data.token, data.expiresAt || ''),
      user: {
        id: data.user.id || 'admin',
        email: data.user.email,
        fullName: data.user.fullName || 'Admin',
        role: data.user.fullName || 'مدير',
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Private mode / blocked storage — leave empty so getValidSession reports clearly
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  private readSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  }
}
