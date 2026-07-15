import { Component } from '@angular/core';
import { ServiceItem } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.component.html',
  styleUrls: ['./services-section.component.scss'],
})
export class ServicesSectionComponent {
  services: ServiceItem[] = this.siteData.getServices();

  constructor(private siteData: SiteDataService) {}
}
