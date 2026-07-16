import { Component, OnDestroy } from '@angular/core';
import { AuthService, AuthUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnDestroy {
  user: AuthUser | null = this.auth.getUser();
  menuOpen = false;

  nav = [
    { label: 'الرئيسية', path: '/dashboard', exact: true, icon: 'home' },
    { label: 'الرسائل', path: '/dashboard/messages', exact: false, icon: 'mail' },
    { label: 'البراندات', path: '/dashboard/brands', exact: false, icon: 'brands' },
    { label: 'المنتجات', path: '/dashboard/products', exact: false, icon: 'box' },
    { label: 'تصنيفات المعرض', path: '/dashboard/gallery-categories', exact: false, icon: 'layers' },
    { label: 'المعرض', path: '/dashboard/gallery', exact: false, icon: 'image' },
    { label: 'الإعدادات', path: '/dashboard/settings', exact: false, icon: 'settings' },
  ];

  constructor(private auth: AuthService) {}

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.syncBodyScroll();
  }

  logout(): void {
    this.auth.logout();
  }

  private syncBodyScroll(): void {
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }
}
