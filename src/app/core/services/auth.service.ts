import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  email: string;
  role: string;
}

const STORAGE_KEY = 'alsafqa_admin_session';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  login(email: string, password: string): { ok: boolean; message?: string } {
    const normalized = email.trim().toLowerCase();
    if (normalized === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user: AuthUser = { email: ADMIN_EMAIL, role: 'مدير' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return { ok: true };
    }
    return { ok: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
