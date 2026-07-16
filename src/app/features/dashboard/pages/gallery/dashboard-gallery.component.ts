import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NO_IMAGE_URL } from '../../../../core/constants/media';
import { GalleryCategoryDto, GalleryDto } from '../../../../core/models/api.models';
import { GalleriesService } from '../../../../core/services/galleries.service';
import { GalleryCategoriesService } from '../../../../core/services/gallery-categories.service';
import { SearchableOption } from '../../../../shared/components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-dashboard-gallery',
  templateUrl: './dashboard-gallery.component.html',
  styleUrls: ['./dashboard-gallery.component.scss'],
})
export class DashboardGalleryComponent implements OnInit {
  items: GalleryDto[] = [];
  categories: GalleryCategoryDto[] = [];
  filterCategoryId: string | null = null;
  loading = true;
  saving = false;
  error = '';
  formOpen = false;
  deleteOpen = false;
  editing: GalleryDto | null = null;
  pendingDelete: GalleryDto | null = null;
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  readonly placeholder = NO_IMAGE_URL;

  constructor(
    private galleriesService: GalleriesService,
    private categoriesService: GalleryCategoriesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      titleAr: ['', Validators.required],
      titleEn: ['', Validators.required],
      descriptionAr: [''],
      descriptionEn: [''],
      galleryCategoryId: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.categoriesService.getAllAdmin().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.categories = [];
      },
    });
    this.refresh();
  }

  get formTitle(): string {
    return this.editing ? 'تعديل صورة المعرض' : 'إضافة صورة للمعرض';
  }

  get activeCount(): number {
    return this.items.filter((item) => item.isActive).length;
  }

  get categoryOptions(): SearchableOption[] {
    return this.categories.map((category) => ({
      id: category.id,
      label: category.nameAr || category.nameEn,
      sublabel:
        category.nameEn && category.nameEn !== category.nameAr
          ? category.nameEn
          : undefined,
    }));
  }

  categoryLabel(category: GalleryCategoryDto): string {
    return category.nameAr || category.nameEn;
  }

  itemTitle(item: GalleryDto): string {
    return item.titleAr || item.titleEn;
  }

  itemImage(item: GalleryDto): string {
    return item.imageUrl || this.placeholder;
  }

  itemCategory(item: GalleryDto): string {
    return item.categoryNameAr || item.categoryNameEn;
  }

  setCategoryFilter(categoryId: string | null): void {
    this.filterCategoryId = categoryId || null;
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.galleriesService.getAllAdmin(this.filterCategoryId).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
        this.error = 'تعذر تحميل صور المعرض. تأكد من تسجيل الدخول.';
      },
    });
  }

  openAdd(): void {
    if (!this.categories.length) {
      this.error = 'أضف تصنيف معرض أولاً قبل إضافة الصور.';
      return;
    }
    this.editing = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.form.reset({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      galleryCategoryId: this.filterCategoryId || this.categories[0]?.id || '',
      isActive: true,
    });
    this.formOpen = true;
  }

  openEdit(item: GalleryDto): void {
    this.editing = item;
    this.selectedFile = null;
    this.previewUrl = item.imageUrl;
    this.form.reset({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr || '',
      descriptionEn: item.descriptionEn || '',
      galleryCategoryId: item.galleryCategoryId,
      isActive: item.isActive,
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
      titleAr: String(value.titleAr).trim(),
      titleEn: String(value.titleEn).trim(),
      descriptionAr: String(value.descriptionAr || '').trim(),
      descriptionEn: String(value.descriptionEn || '').trim(),
      galleryCategoryId: value.galleryCategoryId,
      isActive: !!value.isActive,
      image: this.selectedFile,
    };

    const request$ = this.editing
      ? this.galleriesService.update(this.editing.id, payload)
      : this.galleriesService.create(payload);

    request$.subscribe({
      next: () => {
        this.closeForm();
        this.refresh();
      },
      error: () => {
        this.saving = false;
        this.error = this.editing
          ? 'تعذر حفظ تعديلات الصورة.'
          : 'تعذر إضافة صورة المعرض.';
      },
    });
  }

  askDelete(item: GalleryDto): void {
    this.pendingDelete = item;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.galleriesService.delete(id).subscribe({
      next: () => {
        this.closeDelete();
        this.refresh();
      },
      error: () => {
        this.closeDelete();
        this.error = 'تعذر حذف صورة المعرض.';
      },
    });
  }
}
