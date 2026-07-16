import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NO_IMAGE_URL } from '../../../../core/constants/media';
import { ProductDto } from '../../../../core/models/api.models';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'],
})
export class ProductsSectionComponent implements OnInit {
  products: ProductDto[] = [];
  readonly placeholderImage = NO_IMAGE_URL;

  @ViewChild('track') track?: ElementRef<HTMLElement>;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: () => {
        this.products = [];
      },
    });
  }

  productTitle(product: ProductDto): string {
    return product.nameAr || product.nameEn;
  }

  productImage(product: ProductDto): string {
    return product.imageUrl || this.placeholderImage;
  }

  brandLabel(product: ProductDto): string {
    return product.brandNameAr || product.brandNameEn;
  }

  scroll(direction: 1 | -1): void {
    const el = this.track?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction * -320, behavior: 'smooth' });
  }
}
