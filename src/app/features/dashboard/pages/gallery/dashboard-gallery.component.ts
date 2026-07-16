import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DashGalleryItem,
  DashboardDataService,
} from '../../../../core/services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-gallery',
  templateUrl: './dashboard-gallery.component.html',
  styleUrls: ['./dashboard-gallery.component.scss'],
})
export class DashboardGalleryComponent {
  items: DashGalleryItem[] = [];
  formOpen = false;
  deleteOpen = false;
  editing: DashGalleryItem | null = null;
  pendingDelete: DashGalleryItem | null = null;
  form: FormGroup;

  categories = ['عام', 'شحن', 'لوجستيات', 'منتجات', 'مستودعات'];

  constructor(private data: DashboardDataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['عام', Validators.required],
      image: ['', Validators.required],
      active: [true],
    });
    this.refresh();
  }

  get formTitle(): string {
    return this.editing ? 'تعديل الصورة' : 'إضافة صورة';
  }

  refresh(): void {
    this.items = this.data.getGallery();
  }

  openAdd(): void {
    this.editing = null;
    this.form.reset({ title: '', category: 'عام', image: '', active: true });
    this.formOpen = true;
  }

  openEdit(item: DashGalleryItem): void {
    this.editing = item;
    this.form.reset({
      title: item.title,
      category: item.category,
      image: item.image,
      active: item.active,
    });
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.editing = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Omit<DashGalleryItem, 'id'>;
    if (this.editing) {
      this.data.updateGalleryItem(this.editing.id, value);
    } else {
      this.data.addGalleryItem(value);
    }

    this.closeForm();
    this.refresh();
  }

  askDelete(item: DashGalleryItem): void {
    this.pendingDelete = item;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    this.data.deleteGalleryItem(this.pendingDelete.id);
    this.closeDelete();
    this.refresh();
  }
}
