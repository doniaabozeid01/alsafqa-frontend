import { Component, OnInit } from '@angular/core';
import { ContactMessageDto } from '../../../../core/models/api.models';
import { ContactMessagesService } from '../../../../core/services/contact-messages.service';

@Component({
  selector: 'app-dashboard-messages',
  templateUrl: './dashboard-messages.component.html',
  styleUrls: ['./dashboard-messages.component.scss'],
})
export class DashboardMessagesComponent implements OnInit {
  filter: 'all' | 'unread' = 'all';
  messages: ContactMessageDto[] = [];
  total = 0;
  loading = true;
  error = '';
  deleteOpen = false;
  pendingDelete: ContactMessageDto | null = null;

  constructor(private contactMessages: ContactMessagesService) {}

  ngOnInit(): void {
    this.refresh();
  }

  setFilter(value: 'all' | 'unread'): void {
    this.filter = value;
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.contactMessages.getAll().subscribe({
      next: (list) => {
        this.total = list.length;
        this.messages =
          this.filter === 'unread' ? list.filter((m) => !m.isRead) : list;
        this.loading = false;
      },
      error: () => {
        this.messages = [];
        this.total = 0;
        this.loading = false;
        this.error = 'تعذر تحميل الرسائل. تأكد من تسجيل الدخول وصلاحية المدير.';
      },
    });
  }

  open(msg: ContactMessageDto): void {
    if (msg.isRead) return;
    this.contactMessages.markRead(msg.id).subscribe({
      next: () => this.refresh(),
      error: () => this.refresh(),
    });
  }

  askDelete(msg: ContactMessageDto, event: Event): void {
    event.stopPropagation();
    this.pendingDelete = msg;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.contactMessages.delete(id).subscribe({
      next: () => {
        this.closeDelete();
        this.refresh();
      },
      error: () => {
        this.closeDelete();
        this.error = 'تعذر حذف الرسالة.';
      },
    });
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ar-EG');
  }
}
