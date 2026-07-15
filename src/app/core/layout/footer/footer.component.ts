import { Component } from '@angular/core';
import { NavLink, ServiceItem } from '../../models/site.models';
import { SiteDataService } from '../../services/site-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  navLinks: NavLink[] = this.siteData.getNavLinks();
  services: ServiceItem[] = this.siteData.getServices();
  contact = this.siteData.getContactInfo();
  year = new Date().getFullYear();

  constructor(private siteData: SiteDataService) {}
}
