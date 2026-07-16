import { Component, OnInit } from '@angular/core';
import { ContactMessageDto } from '../../../../core/models/api.models';
import { ContactMessagesService } from '../../../../core/services/contact-messages.service';
import { DashboardDataService } from '../../../../core/services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  latestMessages: ContactMessageDto[] = [];
  cards: Array<{ label: string; value: number; tone: string }> = [];

  constructor(
    private data: DashboardDataService,
    private contactMessages: ContactMessagesService
  ) {}

  ngOnInit(): void {
    const localStats = this.data.getStats();
    this.cards = [
      { label: 'إجمالي الرسائل', value: 0, tone: 'blue' },
      { label: 'رسائل غير مقروءة', value: 0, tone: 'red' },
      { label: 'إجمالي المنتجات', value: localStats.totalProducts, tone: 'green' },
      { label: 'منتجات نشطة', value: localStats.activeProducts, tone: 'gold' },
      { label: 'صور المعرض', value: localStats.galleryImages, tone: 'purple' },
    ];

    this.contactMessages.getAll().subscribe({
      next: (list) => {
        this.latestMessages = list.slice(0, 5);
        const unread = list.filter((m) => !m.isRead).length;
        this.cards = [
          { label: 'إجمالي الرسائل', value: list.length, tone: 'blue' },
          { label: 'رسائل غير مقروءة', value: unread, tone: 'red' },
          { label: 'إجمالي المنتجات', value: localStats.totalProducts, tone: 'green' },
          { label: 'منتجات نشطة', value: localStats.activeProducts, tone: 'gold' },
          { label: 'صور المعرض', value: localStats.galleryImages, tone: 'purple' },
        ];
      },
      error: () => {
        this.latestMessages = [];
      },
    });
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ar-EG');
  }
}
