import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Brand,
  ContactInfo,
  NavLink,
  ProductCategory,
  ServiceItem,
  StatItem,
  StepItem,
} from '../models/site.models';

/**
 * Central place for every piece of static content on the site.
 * When the backend is ready, swap these getters with HTTP calls
 * without touching any component.
 */
@Injectable({ providedIn: 'root' })
export class SiteDataService {
  constructor(private sanitizer: DomSanitizer) {}

  private icon(svgPath: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        ${svgPath}
      </svg>`
    );
  }

  getNavLinks(): NavLink[] {
    return [
      { label: 'الرئيسية', path: '/', exact: true },
      { label: 'عن الشركة', path: '/about' },
      { label: 'خدماتنا', path: '/services' },
      { label: 'المنتجات', path: '/products' },
      { label: 'لماذا نحن', path: '/why-us' },
      { label: 'الأخبار', path: '/news' },
      { label: 'تواصل معنا', path: '/contact' },
    ];
  }

  getContactInfo(): ContactInfo {
    return {
      phone: '+20 123 456 7890',
      email: 'info@globalway-eg.com',
      address: '123 Logistics Way, Cairo, Egypt',
    };
  }

  getServices(): ServiceItem[] {
    return [
      {
        title: 'توريد المنتجات',
        description: 'توريد منتجات عالية الجودة حسب الطلب',
        icon: this.icon(
          `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`
        ),
      },
      {
        title: 'الاستيراد والتصدير',
        description: 'خبرة واسعة في مختلف الأسواق العالمية',
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`
        ),
      },
      {
        title: 'الشحن الدولي',
        description: 'شحن بحري وجوي وبري سريع وآمن',
        icon: this.icon(
          `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`
        ),
      },
      {
        title: 'التخزين والتوزيع',
        description: 'مستودعات حديثة وخدمات توزيع متكاملة',
        icon: this.icon(
          `<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/>`
        ),
      },
      {
        title: 'التخليص الجمركي',
        description: 'تخليص سريع وآمن لجميع أنواع البضائع',
        icon: this.icon(
          `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>`
        ),
      },
    ];
  }

  getSteps(): StepItem[] {
    return [
      {
        order: '01',
        title: 'تقديم الطلب',
        description: 'تواصل معنا وقدّم تفاصيل احتياجاتك',
        emoji: '📋',
      },
      {
        order: '02',
        title: 'تجهيز الطلب',
        description: 'تجهيز وفحص البضائع وفق معايير الجودة',
        emoji: '📦',
      },
      {
        order: '03',
        title: 'الشحن',
        description: 'شحن آمن وسريع بأفضل وسائل النقل',
        emoji: '🚢',
      },
      {
        order: '04',
        title: 'التخليص الجمركي',
        description: 'إنهاء كل الإجراءات الجمركية في وقت قياسي',
        emoji: '🚚',
      },
      {
        order: '05',
        title: 'التسليم',
        description: 'تسليم في الوقت المحدد أينما كنت',
        emoji: '🤝',
      },
    ];
  }

  getStats(): StatItem[] {
    return [
      {
        value: 98,
        prefix: '+',
        suffix: '%',
        label: 'رضا عملائنا',
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`
        ),
      },
      {
        value: 24,
        prefix: '',
        suffix: '/7',
        label: 'دعم متواصل',
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`
        ),
      },
      {
        value: 120,
        prefix: '+',
        suffix: '',
        label: 'دولة حول العالم',
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`
        ),
      },
      {
        value: 2500,
        prefix: '+',
        suffix: '',
        label: 'شحنة سنويًا',
        icon: this.icon(
          `<path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>`
        ),
      },
    ];
  }

  getProductCategories(): ProductCategory[] {
    return [
      {
        title: 'منتجات استهلاكية',
        subtitle: 'ماركات عالمية',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: 'أجهزة إلكترونية',
        subtitle: 'أحدث التقنيات',
        image:
          'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: 'مواد صناعية',
        subtitle: 'جودة موثوقة',
        image:
          'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: 'مواد غذائية',
        subtitle: 'طازجة وآمنة',
        image:
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: 'معدات كهربائية',
        subtitle: 'أساسيات وتوريد',
        image:
          'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=70',
      },
    ];
  }

  getBrands(): Brand[] {
    return [
      { name: 'SAMSUNG', color: '#1428a0' },
      { name: 'Nestlé', color: '#63513d', font: 'serif' },
      { name: 'Unilever', color: '#1f36c7' },
      { name: 'BOSCH', color: '#ea0016' },
      { name: 'P&G', color: '#003da5', font: 'serif' },
      { name: 'PHILIPS', color: '#0b5ed7' },
      { name: 'LG', color: '#a50034' },
      { name: 'Coca-Cola', color: '#f40009', font: 'cursive' },
    ];
  }
}
