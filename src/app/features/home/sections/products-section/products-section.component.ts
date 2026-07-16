import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NO_IMAGE_URL } from '../../../../core/constants/media';
import { ProductDto } from '../../../../core/models/api.models';
import { LanguageService } from '../../../../core/services/language.service';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'],
})
export class ProductsSectionComponent implements OnInit, OnDestroy {
  products: ProductDto[] = [];
  readonly placeholderImage = NO_IMAGE_URL;
  private langSub?: Subscription;

  @ViewChild('track') track?: ElementRef<HTMLElement>;

  constructor(
    private productsService: ProductsService,
    private lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.langSub = this.lang.lang$.subscribe();
    this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products.slice(0, 6);
      },
      error: () => {
        this.products = [];
      },
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
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

  scroll(direction: 1 | -1): void {
    const el = this.track?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction * -320, behavior: 'smooth' });
  }
}
