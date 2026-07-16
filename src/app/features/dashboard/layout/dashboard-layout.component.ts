import { Component } from '@angular/core';
import { AuthService, AuthUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent {
  user: AuthUser | null = this.auth.getUser();
  menuOpen = false;

  nav = [
    { label: 'الرئيسية', path: '/dashboard', exact: true, icon: 'home' },
    { label: 'الرسائل', path: '/dashboard/messages', exact: false, icon: 'mail' },
    { label: 'المنتجات', path: '/dashboard/products', exact: false, icon: 'box' },
    { label: 'المعرض', path: '/dashboard/gallery', exact: false, icon: 'image' },
    { label: 'الإعدادات', path: '/dashboard/settings', exact: false, icon: 'settings' },
  ];

  constructor(private auth: AuthService) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.auth.logout();
  }
}
