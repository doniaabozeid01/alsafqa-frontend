import { Component } from '@angular/core';
import { ServiceItem, StatItem } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.scss'],
})
export class WhyUsComponent {
  hero = this.siteData.getPageHero('why-us');
  values: ServiceItem[] = this.siteData.getWhyUsValues();
  stats: StatItem[] = this.siteData.getStats();

  constructor(private siteData: SiteDataService) {}
}
