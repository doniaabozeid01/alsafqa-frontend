import { Component } from '@angular/core';
import { StatItem } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss'],
})
export class StatsSectionComponent {
  stats: StatItem[] = this.siteData.getStats();

  constructor(private siteData: SiteDataService) {}
}
