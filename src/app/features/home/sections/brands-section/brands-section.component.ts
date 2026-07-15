import { Component } from '@angular/core';
import { Brand } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-brands-section',
  templateUrl: './brands-section.component.html',
  styleUrls: ['./brands-section.component.scss'],
})
export class BrandsSectionComponent {
  brands: Brand[] = this.siteData.getBrands();
  /* duplicated list for the seamless infinite marquee */
  marqueeBrands: Brand[] = [...this.brands, ...this.brands];

  constructor(private siteData: SiteDataService) {}
}
