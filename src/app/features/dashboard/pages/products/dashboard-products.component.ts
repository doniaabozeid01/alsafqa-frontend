import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NO_IMAGE_URL } from '../../../../core/constants/media';
import { BrandDto, ProductDto } from '../../../../core/models/api.models';
import { BrandsService } from '../../../../core/services/brands.service';
import { ProductsService } from '../../../../core/services/products.service';
import { SearchableOption } from '../../../../shared/components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-dashboard-products',
  templateUrl: './dashboard-products.component.html',
  styleUrls: ['./dashboard-products.component.scss'],
})
export class DashboardProductsComponent implements OnInit {
  products: ProductDto[] = [];
  brands: BrandDto[] = [];
  filterBrandId: string | null = null;
  loading = true;
  saving = false;
  error = '';
  formOpen = false;
  deleteOpen = false;
  editing: ProductDto | null = null;
  pendingDelete: ProductDto | null = null;
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  readonly placeholder = NO_IMAGE_URL;

  constructor(
    private productsService: ProductsService,
    private brandsService: BrandsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionAr: [''],
      descriptionEn: [''],
      weightInGrams: [0],
      packageCount: [0],
      brandId: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.brandsService.getAllAdmin().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: () => {
        this.brands = [];
      },
    });
    this.refresh();
  }

  get formTitle(): string {
    return this.editing ? 'تعديل المنتج' : 'إضافة منتج جديد';
  }

  get activeCount(): number {
    return this.products.filter((p) => p.isActive).length;
  }

  get brandOptions(): SearchableOption[] {
    return this.brands.map((brand) => ({
      id: brand.id,
      label: brand.nameAr || brand.nameEn,
      sublabel:
        brand.nameEn && brand.nameEn !== brand.nameAr ? brand.nameEn : undefined,
    }));
  }

  brandLabel(brand: BrandDto): string {
    return brand.nameAr || brand.nameEn;
  }

  productTitle(product: ProductDto): string {
    return product.nameAr || product.nameEn;
  }

  productImage(product: ProductDto): string {
    return product.imageUrl || this.placeholder;
  }

  productBrand(product: ProductDto): string {
    return product.brandNameAr || product.brandNameEn;
  }

  setBrandFilter(brandId: string | null): void {
    this.filterBrandId = brandId || null;
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.productsService.getAllAdmin(this.filterBrandId).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
        this.error = 'تعذر تحميل المنتجات. تأكد من تسجيل الدخول.';
      },
    });
  }

  openAdd(): void {
    if (!this.brands.length) {
      this.error = 'أضف براندًا أولاً قبل إضافة المنتجات.';
      return;
    }
    this.editing = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.form.reset({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      weightInGrams: 0,
      packageCount: 0,
      brandId: this.filterBrandId || this.brands[0]?.id || '',
      isActive: true,
    });
    this.formOpen = true;
  }

  openEdit(product: ProductDto): void {
    this.editing = product;
    this.selectedFile = null;
    this.previewUrl = product.imageUrl;
    this.form.reset({
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      descriptionAr: product.descriptionAr || '',
      descriptionEn: product.descriptionEn || '',
      weightInGrams: product.weightInGrams ?? 0,
      packageCount: product.packageCount ?? 0,
      brandId: product.brandId,
      isActive: product.isActive,
    });
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.editing = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.saving = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFile = file;
    if (file) {
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  save(): void {
    if (this.saving) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const value = this.form.getRawValue();
    const payload = {
      nameAr: String(value.nameAr).trim(),
      nameEn: String(value.nameEn).trim(),
      descriptionAr: String(value.descriptionAr || '').trim(),
      descriptionEn: String(value.descriptionEn || '').trim(),
      weightInGrams: Number(value.weightInGrams) || 0,
      packageCount: Number(value.packageCount) || 0,
      brandId: value.brandId,
      isActive: !!value.isActive,
      image: this.selectedFile,
    };

    const request$ = this.editing
      ? this.productsService.update(this.editing.id, payload)
      : this.productsService.create(payload);

    request$.subscribe({
      next: () => {
        this.closeForm();
        this.refresh();
      },
      error: () => {
        this.saving = false;
        this.error = this.editing
          ? 'تعذر حفظ تعديلات المنتج.'
          : 'تعذر إضافة المنتج.';
      },
    });
  }

  askDelete(product: ProductDto): void {
    this.pendingDelete = product;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.productsService.delete(id).subscribe({
      next: () => {
        this.closeDelete();
        this.refresh();
      },
      error: () => {
        this.closeDelete();
        this.error = 'تعذر حذف المنتج.';
      },
    });
  }
}
