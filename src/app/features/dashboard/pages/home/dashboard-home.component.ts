import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { ContactMessageDto } from '../../../../core/models/api.models';
import { ContactMessagesService } from '../../../../core/services/contact-messages.service';
import { GalleriesService } from '../../../../core/services/galleries.service';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  latestMessages: ContactMessageDto[] = [];
  cards: Array<{ label: string; value: number; tone: string }> = [];

  constructor(
    private contactMessages: ContactMessagesService,
    private productsService: ProductsService,
    private galleriesService: GalleriesService
  ) {}

  ngOnInit(): void {
    forkJoin({
      messages: this.contactMessages.getAll().pipe(catchError(() => of([]))),
      products: this.productsService.getAllAdmin().pipe(catchError(() => of([]))),
      gallery: this.galleriesService.getAllAdmin().pipe(catchError(() => of([]))),
    }).subscribe(({ messages, products, gallery }) => {
        this.latestMessages = messages.slice(0, 5);
        const unread = messages.filter((message) => !message.isRead).length;
        this.cards = [
          { label: 'إجمالي الرسائل', value: messages.length, tone: 'blue' },
          { label: 'رسائل غير مقروءة', value: unread, tone: 'red' },
          { label: 'إجمالي المنتجات', value: products.length, tone: 'green' },
          {
            label: 'منتجات نشطة',
            value: products.filter((product) => product.isActive).length,
            tone: 'gold',
          },
          { label: 'صور المعرض', value: gallery.length, tone: 'purple' },
        ];
    });
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ar-EG');
  }
}
