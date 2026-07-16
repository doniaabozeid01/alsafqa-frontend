import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
})
export class DashboardSettingsComponent {
  form: FormGroup;
  success = false;
  error = '';
  showPass = false;
  email = this.auth.getUser()?.email || '';
  role = this.auth.getUser()?.role || 'مدير';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    });
  }

  togglePass(): void {
    this.showPass = !this.showPass;
  }

  onSubmit(): void {
    this.success = false;
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirm } = this.form.value;
    if (password !== confirm) {
      this.error = 'كلمتا المرور غير متطابقتين';
      return;
    }

    this.success = true;
    this.form.reset();
  }
}
