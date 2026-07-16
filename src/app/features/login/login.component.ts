import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isLoggedIn()) {
      this.goDashboard();
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    this.auth
      .login(email, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          if (result.ok && this.auth.isLoggedIn()) {
            this.goDashboard();
            return;
          }

          this.error =
            result.message ||
            (result.ok
              ? 'تم الدخول لكن تعذر فتح لوحة التحكم.'
              : 'تعذر تسجيل الدخول');
        },
        error: () => {
          this.error = 'تعذر تسجيل الدخول. حاول مرة أخرى.';
        },
      });
  }

  private goDashboard(): void {
    this.router.navigateByUrl('/dashboard').then((ok) => {
      if (!ok && !this.auth.isLoggedIn()) {
        this.error = 'تعذر فتح لوحة التحكم. حاول مرة أخرى.';
      }
    });
  }
}
