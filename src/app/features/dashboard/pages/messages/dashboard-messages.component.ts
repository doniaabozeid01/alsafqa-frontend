import { Component } from '@angular/core';
import { DashMessage, DashboardDataService } from '../../../../core/services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-messages',
  templateUrl: './dashboard-messages.component.html',
  styleUrls: ['./dashboard-messages.component.scss'],
})
export class DashboardMessagesComponent {
  filter: 'all' | 'unread' = 'all';
  messages: DashMessage[] = [];
  deleteOpen = false;
  pendingDelete: DashMessage | null = null;

  constructor(private data: DashboardDataService) {
    this.refresh();
  }

  get total(): number {
    return this.data.getMessages().length;
  }

  setFilter(value: 'all' | 'unread'): void {
    this.filter = value;
    this.refresh();
  }

  refresh(): void {
    const all = this.data.getMessages();
    this.messages = this.filter === 'unread' ? all.filter((m) => !m.read) : all;
  }

  open(msg: DashMessage): void {
    this.data.markRead(msg.id);
    this.refresh();
  }

  askDelete(msg: DashMessage, event: Event): void {
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
    this.data.deleteMessage(this.pendingDelete.id);
    this.closeDelete();
    this.refresh();
  }
}
