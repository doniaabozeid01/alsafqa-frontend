import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NO_IMAGE_URL } from '../../../../core/constants/media';
import { BrandDto, ProductDto, ProductUnitDto } from '../../../../core/models/api.models';
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
  units: ProductUnitDto[] = [];
  filterBrandId: string | null = null;
  loading = true;
  saving = false;
  error = '';
  formError = '';
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
      quantity: [0, [Validators.required, Validators.min(0)]],
      unit: [1, Validators.required],
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
    this.productsService.getUnits().subscribe({
      next: (units) => {
        this.units = units;
        if (units.length && !this.form.value.unit) {
          this.form.patchValue({ unit: units[0].value });
        }
      },
      error: () => {
        this.units = [];
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

  productQuantityLabel(product: ProductDto): string {
    const qty = product.quantity ?? product.weightInGrams;
    if (qty == null || Number(qty) === 0) return '';
    const unit =
      product.unitNameAr ||
      this.units.find((u) => u.value === product.unit)?.nameAr ||
      '';
    return unit ? `${qty} ${unit}` : String(qty);
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
    this.formError = '';
    this.form.reset({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      quantity: 0,
      unit: this.units[0]?.value ?? 1,
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
    this.formError = '';
    this.form.reset({
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      descriptionAr: product.descriptionAr || '',
      descriptionEn: product.descriptionEn || '',
      quantity: product.quantity ?? product.weightInGrams ?? 0,
      unit: product.unit ?? this.units[0]?.value ?? 1,
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
    this.formError = '';
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
      this.formError = 'أكمل الحقول المطلوبة قبل الحفظ.';
      return;
    }

    this.saving = true;
    this.formError = '';
    const value = this.form.getRawValue();
    const payload = {
      nameAr: String(value.nameAr).trim(),
      nameEn: String(value.nameEn).trim(),
      descriptionAr: String(value.descriptionAr || '').trim(),
      descriptionEn: String(value.descriptionEn || '').trim(),
      quantity: Number(value.quantity) || 0,
      unit: Number(value.unit),
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
      error: (err) => {
        this.saving = false;
        this.formError =
          (err instanceof Error && err.message) ||
          this.extractError(err) ||
          (this.editing ? 'تعذر حفظ تعديلات المنتج.' : 'تعذر إضافة المنتج.');
      },
    });
  }

  /** Fallback if error wasn't normalized by the service */
  private extractError(err: unknown): string {
    const httpBody = (err as { error?: unknown })?.error;
    return this.formatApiBody(httpBody);
  }

  private formatApiBody(body: unknown): string {
    if (!body) return '';
    if (typeof body === 'string') {
      const text = body.trim();
      return text && text !== '[object Object]' ? text : '';
    }
    if (typeof body !== 'object') return '';

    const obj = body as {
      message?: string | null;
      Message?: string | null;
      title?: string | null;
      errors?: string[] | Record<string, string[] | string> | null;
      Errors?: string[] | Record<string, string[] | string> | null;
    };

    const message = (obj.message || obj.Message || obj.title || '').trim();
    const errors = obj.errors ?? obj.Errors;

    if (Array.isArray(errors) && errors.length) {
      const list = errors.map(String).filter(Boolean);
      if (list.length) return message ? `${message}: ${list.join(' · ')}` : list.join(' · ');
    }

    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
      const list = Object.entries(errors).flatMap(([key, value]) => {
        const msgs = Array.isArray(value) ? value : [value];
        return msgs
          .map(String)
          .filter(Boolean)
          .map((msg) => (key ? `${key}: ${msg}` : msg));
      });
      if (list.length) return message ? `${message}: ${list.join(' · ')}` : list.join(' · ');
    }

    return message;
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
