import { Component, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavLink } from '../../models/site.models';
import { LanguageService } from '../../services/language.service';
import { SiteDataService } from '../../services/site-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  navLinks: NavLink[] = [];
  contact = this.siteData.getContactInfo();
  scrolled = false;
  menuOpen = false;
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    public lang: LanguageService
  ) {
    this.refresh();
    this.sub = this.lang.lang$.subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

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

  toggleLang(): void {
    this.lang.toggle();
  }

  private refresh(): void {
    this.navLinks = this.siteData.getNavLinks();
    this.contact = this.siteData.getContactInfo();
  }
}
