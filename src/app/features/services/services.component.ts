import { Component } from '@angular/core';
import { ServiceItem } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  hero = this.siteData.getPageHero('services');
  services: ServiceItem[] = this.siteData.getServices();

  constructor(private siteData: SiteDataService) {}
}
