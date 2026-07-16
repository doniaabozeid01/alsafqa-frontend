import { Component } from '@angular/core';
import { ProductCategory } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  hero = this.siteData.getPageHero('products');
  categories: ProductCategory[] = this.siteData.getProductCategories();

  constructor(private siteData: SiteDataService) {}
}
