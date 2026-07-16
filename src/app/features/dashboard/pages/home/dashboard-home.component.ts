import { Component } from '@angular/core';
import { DashboardDataService } from '../../../../core/services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent {
  stats = this.data.getStats();
  latestMessages = this.data.getMessages().slice(0, 5);

  cards = [
    { label: 'إجمالي الرسائل', value: this.stats.totalMessages, tone: 'blue' },
    { label: 'رسائل غير مقروءة', value: this.stats.unreadMessages, tone: 'red' },
    { label: 'إجمالي المنتجات', value: this.stats.totalProducts, tone: 'green' },
    { label: 'منتجات نشطة', value: this.stats.activeProducts, tone: 'gold' },
    { label: 'صور المعرض', value: this.stats.galleryImages, tone: 'purple' },
  ];

  constructor(private data: DashboardDataService) {}
}
