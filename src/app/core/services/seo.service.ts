import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../services/language.service';

interface PageSeo {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

const DEFAULT: PageSeo = {
  titleAr: 'الاتحاد التجارية | استيراد وتصدير وشحن دولي',
  titleEn: 'Al-Ittihad Trading | Import, Export & International Shipping',
  descAr:
    'الاتحاد التجارية للاستيراد والتصدير والشحن والتخليص الجمركي — Quality Beyond Borders. Excellence Without Limits.',
  descEn:
    'Al-Ittihad Trading for import, export, shipping and customs clearance — Quality Beyond Borders. Excellence Without Limits.',
};

const PAGES: Record<string, PageSeo> = {
  '/': DEFAULT,
  '/about': {
    titleAr: 'من نحن | الاتحاد التجارية',
    titleEn: 'About Us | Al-Ittihad Trading',
    descAr: 'تعرّف على الاتحاد التجارية ورؤيتنا في الاستيراد والتصدير والشحن الدولي.',
    descEn: 'Learn about Al-Ittihad Trading and our vision in import, export and international shipping.',
  },
  '/products': {
    titleAr: 'المنتجات | الاتحاد التجارية',
    titleEn: 'Products | Al-Ittihad Trading',
    descAr: 'استعرض منتجاتنا من أفضل العلامات العالمية مع خيارات التوريد حسب الطلب.',
    descEn: 'Browse our products from leading global brands with on-demand supply options.',
  },
  '/gallery': {
    titleAr: 'المعرض | الاتحاد التجارية',
    titleEn: 'Gallery | Al-Ittihad Trading',
    descAr: 'لمحة مصوّرة عن عملياتنا اللوجستية وخدمات الشحن والتخزين.',
    descEn: 'A visual look at our logistics operations, shipping and warehousing.',
  },
  '/contact': {
    titleAr: 'تواصل معنا | الاتحاد التجارية',
    titleEn: 'Contact Us | Al-Ittihad Trading',
    descAr: 'تواصل مع الاتحاد التجارية للحصول على حلول استيراد وتصدير وشحن مخصصة.',
    descEn: 'Contact Al-Ittihad Trading for tailored import, export and shipping solutions.',
  },
  '/login': {
    titleAr: 'تسجيل الدخول | الاتحاد التجارية',
    titleEn: 'Sign In | Al-Ittihad Trading',
    descAr: 'سجّل دخولك إلى لوحة تحكم الاتحاد التجارية.',
    descEn: 'Sign in to the Al-Ittihad Trading dashboard.',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private lang: LanguageService
  ) {}

  init(): void {
    this.applyShareDefaults();
    this.updateForUrl(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateForUrl(e.urlAfterRedirects));
    this.lang.lang$.subscribe(() => this.updateForUrl(this.router.url));
  }

  private updateForUrl(url: string): void {
    const path = (url.split('?')[0] || '/').replace(/\/$/, '') || '/';
    const page = PAGES[path] || (path.startsWith('/dashboard') ? {
      titleAr: 'لوحة التحكم | الاتحاد التجارية',
      titleEn: 'Dashboard | Al-Ittihad Trading',
      descAr: DEFAULT.descAr,
      descEn: DEFAULT.descEn,
    } : DEFAULT);

    const isEn = this.lang.current === 'en';
    const title = isEn ? page.titleEn : page.titleAr;
    const description = isEn ? page.descEn : page.descAr;
    const pageUrl = this.origin() + (path === '/' ? '/' : path);
    const image = this.origin() + '/assets/brand/og-image.png';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: isEn
      ? 'Al-Ittihad Trading, import, export, shipping, customs, logistics, Cairo'
      : 'الاتحاد التجارية, استيراد, تصدير, شحن, تخليص جمركي, لوجستيات, القاهرة' });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: isEn ? 'en_US' : 'ar_AR' });

    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(pageUrl);
  }

  private applyShareDefaults(): void {
    const image = this.origin() + '/assets/brand/og-image.png';
    const site = this.origin() + '/';

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'الاتحاد التجارية' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'الاتحاد التجارية — Al-Ittihad Trading' });
    this.meta.updateTag({ property: 'og:url', content: site });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  private origin(): string {
    const configured = (environment as { siteUrl?: string }).siteUrl?.replace(/\/$/, '');
    if (configured) return configured;
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }
    return '';
  }

  private setCanonical(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
