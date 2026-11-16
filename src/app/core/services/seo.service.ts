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
  titleAr: 'شركة الصفقة للاستيراد والتصدير والتوريدات العمومية والتوكيلات التجارية',
  titleEn: 'Al Safqa | Import, Export, General Supplies & Commercial Agencies',
  descAr:
    'شركة الصفقة للاستيراد والتصدير والتوريدات العمومية والتوكيلات التجارية، نوفر منتجات موثوقة وحلول تجارة دولية باحترافية وجودة.',
  descEn:
    'Al Safqa provides professional import, export, general supplies and commercial agency solutions.',
};

const PAGES: Record<string, PageSeo> = {
  '/': DEFAULT,
  '/about': {
    titleAr: 'من نحن | شركة الصفقة للاستيراد والتصدير',
    titleEn: 'About Us | Al Safqa',
    descAr: 'تعرّف على شركة الصفقة ورؤيتنا وخبرتنا في الاستيراد والتصدير والشحن الدولي.',
    descEn: 'Learn about Al Safqa and our experience in import, export and international shipping.',
  },
  '/products': {
    titleAr: 'منتجاتنا | شركة الصفقة للاستيراد والتصدير',
    titleEn: 'Products | Al Safqa',
    descAr: 'استعرض منتجات شركة الصفقة من العلامات الموثوقة مع خيارات التوريد والاستيراد والتصدير حسب الطلب.',
    descEn: 'Browse Al Safqa products from trusted brands with flexible supply and export options.',
  },
  '/gallery': {
    titleAr: 'المعرض | شركة الصفقة للاستيراد والتصدير',
    titleEn: 'Gallery | Al Safqa',
    descAr: 'لمحة مصوّرة عن عملياتنا اللوجستية وخدمات الشحن والتخزين.',
    descEn: 'A visual look at our logistics operations, shipping and warehousing.',
  },
  '/contact': {
    titleAr: 'تواصل معنا | شركة الصفقة للاستيراد والتصدير',
    titleEn: 'Contact Us | Al Safqa',
    descAr: 'تواصل مع شركة الصفقة للحصول على حلول استيراد وتصدير وشحن مخصصة.',
    descEn: 'Contact Al Safqa for tailored import, export and shipping solutions.',
  },
  '/login': {
    titleAr: 'تسجيل الدخول | شركة الصفقة',
    titleEn: 'Sign In | Al Safqa',
    descAr: 'سجّل دخولك إلى لوحة تحكم الصفقة.',
    descEn: 'Sign in to the Al Safqa dashboard.',
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
      titleAr: 'لوحة التحكم | شركة الصفقة',
      titleEn: 'Dashboard | Al Safqa',
      descAr: DEFAULT.descAr,
      descEn: DEFAULT.descEn,
    } : DEFAULT);

    const isEn = this.lang.current === 'en';
    const title = isEn ? page.titleEn : page.titleAr;
    const description = isEn ? page.descEn : page.descAr;
    const pageUrl = this.origin() + (path === '/' ? '/' : path);
    const image = this.origin() + '/assets/brand/logo-social.png';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: isEn
      ? 'Al Safqa, import, export, general supplies, commercial agencies, international shipping, logistics, Egypt'
      : 'شركة الصفقة, الصفقة للاستيراد والتصدير, استيراد, تصدير, توريدات عمومية, توكيلات تجارية, شحن دولي, لوجستيات, مصر' });
    this.meta.updateTag({
      name: 'robots',
      content: path === '/login' || path.startsWith('/dashboard')
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large',
    });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:url', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:locale', content: isEn ? 'en_US' : 'ar_AR' });

    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(pageUrl);
  }

  private applyShareDefaults(): void {
    const image = this.origin() + '/assets/brand/logo-social.png';
    const site = this.origin() + '/';

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'شركة الصفقة للاستيراد والتصدير والتوريدات العمومية والتوكيلات التجارية' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:url', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '1200' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'شركة الصفقة للاستيراد والتصدير والتوريدات العمومية والتوكيلات التجارية — Al Safqa' });
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
