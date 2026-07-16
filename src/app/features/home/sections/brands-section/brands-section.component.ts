import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-brands-section',
  templateUrl: './brands-section.component.html',
  styleUrls: ['./brands-section.component.scss'],
})
export class BrandsSectionComponent {
  brands: Brand[] = this.siteData.getBrands();
  marqueeBrands: Brand[] = [...this.brands, ...this.brands];

  constructor(
    private siteData: SiteDataService,
    private router: Router
  ) {}

  openBrand(brand: Brand, event: Event): void {
    event.preventDefault();
    this.router.navigate(['/products'], { queryParams: { brand: brand.name } });
  }
}
