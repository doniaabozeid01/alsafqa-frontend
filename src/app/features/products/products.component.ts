import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand, ProductCategory } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  hero = this.siteData.getPageHero('products');
  brands: Brand[] = this.siteData.getBrands();
  allProducts: ProductCategory[] = this.siteData.getProductCategories();
  filteredProducts: ProductCategory[] = this.allProducts;
  selectedBrand: string | null = null;

  constructor(
    private siteData: SiteDataService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.applyBrand(this.route.snapshot.queryParamMap.get('brand'));
  }

  selectBrand(brand: string | null): void {
    this.applyBrand(brand);

    const url = this.router
      .createUrlTree([], {
        relativeTo: this.route,
        queryParams: brand ? { brand } : {},
      })
      .toString();

    this.location.replaceState(url);
  }

  private applyBrand(brand: string | null): void {
    const match = brand
      ? this.brands.find((b) => b.name.toLowerCase() === brand.toLowerCase())
      : null;

    this.selectedBrand = match?.name ?? null;
    this.filteredProducts = this.selectedBrand
      ? this.allProducts.filter((p) => p.brand === this.selectedBrand)
      : this.allProducts;
  }
}
