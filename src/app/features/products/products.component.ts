import { Location } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NO_IMAGE_URL } from '../../core/constants/media';
import { BrandDto, ProductDto } from '../../core/models/api.models';
import { BrandsService } from '../../core/services/brands.service';
import { LanguageService } from '../../core/services/language.service';
import { ProductsService } from '../../core/services/products.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('brandPicker') brandPicker?: ElementRef<HTMLElement>;

  hero = this.siteData.getPageHero('products');
  brands: BrandDto[] = [];
  products: ProductDto[] = [];
  selectedBrandId: string | null = null;
  brandQuery = '';
  pickerOpen = false;
  loading = true;
  readonly placeholderImage = NO_IMAGE_URL;
  private langSub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private brandsService: BrandsService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private lang: LanguageService
  ) {
    this.langSub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('products');
    });
  }

  get isArabic(): boolean {
    return this.lang.current === 'ar';
  }

  ngOnInit(): void {
    const brandId = this.route.snapshot.queryParamMap.get('brandId');
    this.selectedBrandId = brandId;

    this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
        if (brandId && !brands.some((b) => b.id === brandId)) {
          this.selectedBrandId = null;
        }
      },
      error: () => {
        this.brands = [];
      },
    });

    this.loadProducts(this.selectedBrandId);
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  get selectedBrand(): BrandDto | null {
    if (!this.selectedBrandId) return null;
    return this.brands.find((b) => b.id === this.selectedBrandId) ?? null;
  }

  get filteredBrands(): BrandDto[] {
    const q = this.brandQuery.trim().toLowerCase();
    if (!q) return this.brands;
    return this.brands.filter(
      (b) =>
        (b.nameAr || '').toLowerCase().includes(q) ||
        (b.nameEn || '').toLowerCase().includes(q)
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const host = this.brandPicker?.nativeElement;
    if (!host) return;
    if (!host.contains(event.target as Node)) {
      this.pickerOpen = false;
    }
  }

  onBrandQuery(event: Event): void {
    this.brandQuery = (event.target as HTMLInputElement).value;
    this.pickerOpen = true;
  }

  openPicker(): void {
    this.pickerOpen = true;
  }

  selectBrand(brandId: string | null): void {
    this.selectedBrandId = brandId;
    this.brandQuery = '';
    this.pickerOpen = false;

    const url = this.router
      .createUrlTree([], {
        relativeTo: this.route,
        queryParams: brandId ? { brandId } : {},
      })
      .toString();

    this.location.replaceState(url);
    this.loadProducts(brandId);
  }

  productTitle(product: ProductDto): string {
    return this.lang.localized(product.nameAr, product.nameEn);
  }

  productImage(product: ProductDto): string {
    return product.imageUrl || this.placeholderImage;
  }

  brandLabel(product: ProductDto): string {
    return this.lang.localized(product.brandNameAr, product.brandNameEn);
  }

  brandName(brand: BrandDto): string {
    return this.lang.localized(brand.nameAr, brand.nameEn);
  }

  private loadProducts(brandId: string | null): void {
    this.loading = true;
    this.productsService.getAll(brandId).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
      },
    });
  }
}
