import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavLink, ServiceItem } from '../../models/site.models';
import { LanguageService } from '../../services/language.service';
import { SiteDataService } from '../../services/site-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnDestroy {
  navLinks: NavLink[] = [];
  services: ServiceItem[] = [];
  contact = this.siteData.getContactInfo();
  year = new Date().getFullYear();
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.refresh();
    this.sub = this.lang.lang$.subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private refresh(): void {
    this.navLinks = this.siteData.getNavLinks();
    this.services = this.siteData.getServices();
    this.contact = this.siteData.getContactInfo();
  }
}
