import { Component, HostListener } from '@angular/core';
import { NavLink } from '../../models/site.models';
import { SiteDataService } from '../../services/site-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navLinks: NavLink[] = this.siteData.getNavLinks();
  contact = this.siteData.getContactInfo();
  scrolled = false;
  menuOpen = false;

  constructor(private siteData: SiteDataService) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 40;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
