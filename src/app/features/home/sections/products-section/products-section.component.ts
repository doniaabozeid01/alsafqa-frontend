import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductCategory } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'],
})
export class ProductsSectionComponent {
  categories: ProductCategory[] = this.siteData.getProductCategories();

  @ViewChild('track') track?: ElementRef<HTMLElement>;

  constructor(private siteData: SiteDataService) {}

  scroll(direction: 1 | -1): void {
    const el = this.track?.nativeElement;
    if (!el) {
      return;
    }
    // In RTL, positive scrollLeft direction is flipped by the browser
    el.scrollBy({ left: direction * -320, behavior: 'smooth' });
  }
}
