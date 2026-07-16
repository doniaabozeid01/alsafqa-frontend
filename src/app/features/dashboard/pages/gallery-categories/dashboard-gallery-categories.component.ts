import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GalleryCategoryDto } from '../../../../core/models/api.models';
import { GalleryCategoriesService } from '../../../../core/services/gallery-categories.service';

@Component({
  selector: 'app-dashboard-gallery-categories',
  templateUrl: './dashboard-gallery-categories.component.html',
  styleUrls: ['./dashboard-gallery-categories.component.scss'],
})
export class DashboardGalleryCategoriesComponent implements OnInit {
  categories: GalleryCategoryDto[] = [];
  loading = true;
  saving = false;
  error = '';
  formOpen = false;
  deleteOpen = false;
  editing: GalleryCategoryDto | null = null;
  pendingDelete: GalleryCategoryDto | null = null;
  form: FormGroup;

  constructor(
    private categoriesService: GalleryCategoriesService,
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
    return this.editing ? 'تعديل التصنيف' : 'إضافة تصنيف معرض';
  }

  get activeCount(): number {
    return this.categories.filter((c) => c.isActive).length;
  }

  categoryLabel(category: GalleryCategoryDto): string {
    return category.nameAr || category.nameEn;
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.categoriesService.getAllAdmin().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        this.categories = [];
        this.loading = false;
        this.error = 'تعذر تحميل تصنيفات المعرض. تأكد من تسجيل الدخول.';
      },
    });
  }

  openAdd(): void {
    this.editing = null;
    this.form.reset({ nameAr: '', nameEn: '', isActive: true });
    this.formOpen = true;
  }

  openEdit(category: GalleryCategoryDto): void {
    this.editing = category;
    this.form.reset({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      isActive: category.isActive,
    });
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.editing = null;
    this.saving = false;
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
      nameAr: String(nameAr).trim(),
      nameEn: String(nameEn).trim(),
      isActive: !!isActive,
    };

    const request$ = this.editing
      ? this.categoriesService.update(this.editing.id, payload)
      : this.categoriesService.create(payload);

    request$.subscribe({
      next: () => {
        this.closeForm();
        this.refresh();
      },
      error: () => {
        this.saving = false;
        this.error = this.editing
          ? 'تعذر حفظ تعديلات التصنيف.'
          : 'تعذر إضافة التصنيف.';
      },
    });
  }

  askDelete(category: GalleryCategoryDto): void {
    this.pendingDelete = category;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.categoriesService.delete(id).subscribe({
      next: () => {
        this.closeDelete();
        this.refresh();
      },
      error: () => {
        this.closeDelete();
        this.error = 'تعذر حذف التصنيف. قد يكون مرتبطًا بصور في المعرض.';
      },
    });
  }
}
