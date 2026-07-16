import { Component } from '@angular/core';
import { BrandCard } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-brand-section',
  templateUrl: './brand-section.component.html',
  styleUrls: ['./brand-section.component.scss'],
})
export class BrandSectionComponent {
  brand = this.siteData.getBrandSection();

  constructor(private siteData: SiteDataService) {}
}
