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
  titleAr: 'شركة الاتحاد التجارية للاستيراد والتصدير | شحن وتجارة دولية',
  titleEn: 'Al-Ittihad Trading Company | Import, Export & International Shipping',
  descAr:
    'شركة الاتحاد التجارية للاستيراد والتصدير والشحن والتخليص الجمركي، نوفر منتجات موثوقة وحلول تجارة دولية باحترافية وجودة.',
  descEn:
    'Al-Ittihad Trading Company provides professional import, export, international shipping and customs clearance solutions.',
};

const PAGES: Record<string, PageSeo> = {
  '/': DEFAULT,
  '/about': {
    titleAr: 'من نحن | شركة الاتحاد التجارية للاستيراد والتصدير',
    titleEn: 'About Us | Al-Ittihad Trading Company',
    descAr: 'تعرّف على شركة الاتحاد التجارية ورؤيتنا وخبرتنا في الاستيراد والتصدير والشحن الدولي.',
    descEn: 'Learn about Al-Ittihad Trading Company and our experience in import, export and international shipping.',
  },
  '/products': {
    titleAr: 'منتجاتنا | شركة الاتحاد التجارية للاستيراد والتصدير',
    titleEn: 'Products | Al-Ittihad Trading Company',
    descAr: 'استعرض منتجات شركة الاتحاد التجارية من العلامات الموثوقة مع خيارات التوريد والاستيراد والتصدير حسب الطلب.',
    descEn: 'Browse Al-Ittihad Trading Company products from trusted brands with flexible supply and export options.',
  },
  '/gallery': {
    titleAr: 'المعرض | شركة الاتحاد التجارية للاستيراد والتصدير',
    titleEn: 'Gallery | Al-Ittihad Trading Company',
    descAr: 'لمحة مصوّرة عن عملياتنا اللوجستية وخدمات الشحن والتخزين.',
    descEn: 'A visual look at our logistics operations, shipping and warehousing.',
  },
  '/contact': {
    titleAr: 'تواصل معنا | شركة الاتحاد التجارية للاستيراد والتصدير',
    titleEn: 'Contact Us | Al-Ittihad Trading Company',
    descAr: 'تواصل مع شركة الاتحاد التجارية للحصول على حلول استيراد وتصدير وشحن مخصصة.',
    descEn: 'Contact Al-Ittihad Trading Company for tailored import, export and shipping solutions.',
  },
  '/login': {
    titleAr: 'تسجيل الدخول | شركة الاتحاد التجارية',
    titleEn: 'Sign In | Al-Ittihad Trading Company',
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
      titleAr: 'لوحة التحكم | شركة الاتحاد التجارية',
      titleEn: 'Dashboard | Al-Ittihad Trading Company',
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
      ? 'Al-Ittihad Trading Company, import, export, international shipping, customs clearance, logistics, Egypt'
      : 'شركة الاتحاد التجارية, الاتحاد التجارية للاستيراد والتصدير, استيراد, تصدير, شحن دولي, تخليص جمركي, لوجستيات, مصر' });
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
    this.meta.updateTag({ property: 'og:site_name', content: 'شركة الاتحاد التجارية للاستيراد والتصدير' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:url', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '1200' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'شركة الاتحاد التجارية للاستيراد والتصدير — Al-Ittihad Trading Company' });
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
