import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DashProduct,
  DashboardDataService,
} from '../../../../core/services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-products',
  templateUrl: './dashboard-products.component.html',
  styleUrls: ['./dashboard-products.component.scss'],
})
export class DashboardProductsComponent {
  products: DashProduct[] = [];
  formOpen = false;
  deleteOpen = false;
  editing: DashProduct | null = null;
  pendingDelete: DashProduct | null = null;
  form: FormGroup;

  constructor(private data: DashboardDataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      image: ['', Validators.required],
      active: [true],
    });
    this.refresh();
  }

  get formTitle(): string {
    return this.editing ? 'تعديل المنتج' : 'إضافة منتج';
  }

  refresh(): void {
    this.products = this.data.getProducts();
  }

  openAdd(): void {
    this.editing = null;
    this.form.reset({ title: '', subtitle: '', image: '', active: true });
    this.formOpen = true;
  }

  openEdit(product: DashProduct): void {
    this.editing = product;
    this.form.reset({
      title: product.title,
      subtitle: product.subtitle,
      image: product.image,
      active: product.active,
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

    const value = this.form.value as Omit<DashProduct, 'id'>;
    if (this.editing) {
      this.data.updateProduct(this.editing.id, value);
    } else {
      this.data.addProduct(value);
    }

    this.closeForm();
    this.refresh();
  }

  askDelete(product: DashProduct): void {
    this.pendingDelete = product;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    this.data.deleteProduct(this.pendingDelete.id);
    this.closeDelete();
    this.refresh();
  }
}
