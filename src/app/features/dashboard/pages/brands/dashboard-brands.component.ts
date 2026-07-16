import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NO_IMAGE_URL } from '../../../../core/constants/media';
import { BrandDto } from '../../../../core/models/api.models';
import { BrandsService } from '../../../../core/services/brands.service';

@Component({
  selector: 'app-dashboard-brands',
  templateUrl: './dashboard-brands.component.html',
  styleUrls: ['./dashboard-brands.component.scss'],
})
export class DashboardBrandsComponent implements OnInit {
  brands: BrandDto[] = [];
  loading = true;
  saving = false;
  error = '';
  formOpen = false;
  deleteOpen = false;
  editing: BrandDto | null = null;
  pendingDelete: BrandDto | null = null;
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  readonly placeholder = NO_IMAGE_URL;

  constructor(
    private brandsService: BrandsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  get formTitle(): string {
    return this.editing ? 'تعديل البراند' : 'إضافة براند جديد';
  }

  get activeCount(): number {
    return this.brands.filter((b) => b.isActive).length;
  }

  get productsLinked(): number {
    return this.brands.reduce((sum, b) => sum + (b.productsCount || 0), 0);
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.brandsService.getAllAdmin().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.loading = false;
      },
      error: () => {
        this.brands = [];
        this.loading = false;
        this.error = 'تعذر تحميل البراندات. تأكد من تسجيل الدخول.';
      },
    });
  }

  brandImage(brand: BrandDto): string {
    return brand.imageUrl || this.placeholder;
  }

  openAdd(): void {
    this.editing = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.form.reset({ nameAr: '', nameEn: '', isActive: true });
    this.formOpen = true;
  }

  openEdit(brand: BrandDto): void {
    this.editing = brand;
    this.selectedFile = null;
    this.previewUrl = brand.imageUrl;
    this.form.reset({
      nameAr: brand.nameAr,
      nameEn: brand.nameEn,
      isActive: brand.isActive,
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
    const { nameAr, nameEn, isActive } = this.form.getRawValue();
    const payload = {
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      isActive: !!isActive,
      image: this.selectedFile,
    };

    const request$ = this.editing
      ? this.brandsService.update(this.editing.id, payload)
      : this.brandsService.create(payload);

    request$.subscribe({
      next: () => {
        this.closeForm();
        this.refresh();
      },
      error: () => {
        this.saving = false;
        this.error = this.editing
          ? 'تعذر حفظ تعديلات البراند.'
          : 'تعذر إضافة البراند.';
      },
    });
  }

  askDelete(brand: BrandDto): void {
    this.pendingDelete = brand;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.brandsService.delete(id).subscribe({
      next: () => {
        this.closeDelete();
        this.refresh();
      },
      error: () => {
        this.closeDelete();
        this.error = 'تعذر حذف البراند. قد يكون مرتبطًا بمنتجات.';
      },
    });
  }
}
