import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AboutPageContent,
  Brand,
  BrandCard,
  ContactInfo,
  GalleryImage,
  JourneyStep,
  NavLink,
  NewsItem,
  PageHero,
  ProductCategory,
  ServiceItem,
  StatItem,
  StepItem,
} from '../models/site.models';
import { LanguageService } from './language.service';

/**
 * Central place for every piece of static content on the site.
 * When the backend is ready, swap these getters with HTTP calls
 * without touching any component.
 */
@Injectable({ providedIn: 'root' })
export class SiteDataService {
  constructor(
    private sanitizer: DomSanitizer,
    private lang: LanguageService
  ) {}

  private L(ar: string, en: string): string {
    return this.lang.localized(ar, en);
  }

  private t(key: string): string {
    return this.lang.t(key);
  }

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
      { label: this.t('nav.home'), path: '/', exact: true },
      { label: this.t('nav.about'), path: '/about' },
      { label: this.t('nav.products'), path: '/products' },
      { label: this.t('nav.brand'), path: '/', fragment: 'brand' },
      { label: this.t('nav.gallery'), path: '/gallery' },
      { label: this.t('nav.contact'), path: '/contact' },
    ];
  }

  getContactInfo(): ContactInfo {
    return {
      phone: '01050302172',
      phones: ['01050302172', '01210077500'],
      email: 'info@al-ittihad.com',
      address: this.t('contact.address'),
    };
  }

  getServices(): ServiceItem[] {
    return [
      {
        title: this.L('توريد المنتجات', 'Product supply'),
        description: this.L(
          'توريد منتجات عالية الجودة حسب الطلب',
          'High-quality product supply on demand'
        ),
        icon: this.icon(
          `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`
        ),
      },
      {
        title: this.L('الاستيراد والتصدير', 'Import & export'),
        description: this.L(
          'خبرة واسعة في مختلف الأسواق العالمية',
          'Deep experience across global markets'
        ),
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`
        ),
      },
      {
        title: this.L('الشحن الدولي', 'International shipping'),
        description: this.L(
          'شحن بحري وجوي وبري سريع وآمن',
          'Fast and secure sea, air and land freight'
        ),
        icon: this.icon(
          `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`
        ),
      },
      {
        title: this.L('التخزين والتوزيع', 'Warehousing & distribution'),
        description: this.L(
          'مستودعات حديثة وخدمات توزيع متكاملة',
          'Modern warehouses and end-to-end distribution'
        ),
        icon: this.icon(
          `<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/>`
        ),
      },
      {
        title: this.L('التخليص الجمركي', 'Customs clearance'),
        description: this.L(
          'تخليص سريع وآمن لجميع أنواع البضائع',
          'Fast and secure clearance for all cargo types'
        ),
        icon: this.icon(
          `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>`
        ),
      },
    ];
  }

  getJourneySteps(): JourneyStep[] {
    return [
      {
        order: '01',
        title: this.L('تقديم الطلب', 'Submit request'),
        description: this.L(
          'تواصل معنا وقدّم تفاصيل احتياجاتك',
          'Contact us and share your requirements'
        ),
        icon: this.icon(
          `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>`
        ),
      },
      {
        order: '02',
        title: this.L('دراسة المشروع', 'Project study'),
        description: this.L(
          'تحليل السوق وتقييم الجدوى والتكلفة',
          'Market analysis, feasibility and cost review'
        ),
        icon: this.icon(
          `<path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>`
        ),
      },
      {
        order: '03',
        title: this.L('تجهيز الطلب', 'Order preparation'),
        description: this.L(
          'تجهيز وفحص البضائع وفق معايير الجودة',
          'Prepare and inspect goods to quality standards'
        ),
        icon: this.icon(
          `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`
        ),
      },
      {
        order: '04',
        title: this.L('الشحن', 'Shipping'),
        description: this.L(
          'شحن آمن وسريع بأفضل وسائل النقل',
          'Safe, fast shipping via the best transport modes'
        ),
        icon: this.icon(
          `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`
        ),
      },
      {
        order: '05',
        title: this.L('التخليص الجمركي', 'Customs clearance'),
        description: this.L(
          'إنهاء كل الإجراءات الجمركية في وقت قياسي',
          'Complete all customs procedures in record time'
        ),
        icon: this.icon(
          `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>`
        ),
      },
      {
        order: '06',
        title: this.L('التسليم', 'Delivery'),
        description: this.L(
          'تسليم في الوقت المحدد أينما كنت',
          'On-time delivery wherever you are'
        ),
        icon: this.icon(
          `<path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>`
        ),
      },
      {
        order: '07',
        title: this.L('شراكة مستمرة', 'Ongoing partnership'),
        description: this.L(
          'دعم مستمر وتطوير علاقة تجارية طويلة الأمد',
          'Continuous support and a long-term trade relationship'
        ),
        icon: this.icon(
          `<path d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>`
        ),
        isFinal: true,
      },
    ];
  }

  getNews(): NewsItem[] {
    return [
      {
        title: this.L(
          'توسع جديد في خطوط الشحن البحري',
          'New expansion in sea freight lines'
        ),
        excerpt: this.L(
          'نعلن عن إضافة خطوط شحن جديدة تربط مصر بأهم الموانئ العالمية.',
          'We are adding new shipping lines connecting Egypt to major world ports.'
        ),
        date: this.L('مارس 2026', 'March 2026'),
        category: this.L('أخبار الشركة', 'Company news'),
      },
      {
        title: this.L(
          'شراكة استراتيجية مع علامات عالمية',
          'Strategic partnership with global brands'
        ),
        excerpt: this.L(
          'توقيع اتفاقيات توريد جديدة مع كبرى الشركات العالمية في قطاع الاستهلاك.',
          'New supply agreements with major global consumer brands.'
        ),
        date: this.L('فبراير 2026', 'February 2026'),
        category: this.L('شراكات', 'Partnerships'),
      },
      {
        title: this.L(
          'افتتاح مستودع جديد بالقاهرة',
          'New warehouse opens in Cairo'
        ),
        excerpt: this.L(
          'مستودع حديث بمساحة 5000 متر مربع لتعزيز خدمات التخزين والتوزيع.',
          'A modern 5,000 m² warehouse to strengthen storage and distribution.'
        ),
        date: this.L('يناير 2026', 'January 2026'),
        category: this.L('توسعات', 'Expansion'),
      },
    ];
  }

  getPageHero(key: string): PageHero {
    const heroes: Record<string, PageHero> = {
      about: {
        tag: this.t('nav.about'),
        title: this.L(
          'الاتحاد التجارية للاستيراد والتصدير',
          'Al-Ittihad Trading for import and export'
        ),
        subtitle: this.L(
          'إحدى الشركات الرائدة في الاستيراد والتصدير والشحن والتخليص الجمركي إلى أسواق الشرق الأوسط والعالم',
          'A leading company in import, export, shipping and customs clearance across the Middle East and beyond'
        ),
      },
      services: {
        tag: this.t('home.services.tag'),
        title: this.t('home.services.title'),
        subtitle: this.L(
          'من التوريد إلى التسليم — نغطي كل احتياجاتك',
          'From supply to delivery — we cover all your needs'
        ),
      },
      products: {
        tag: this.t('home.products.tag'),
        title: this.t('home.products.title'),
        subtitle: this.L(
          'تشكيلة واسعة من المنتجات من أفضل الماركات العالمية',
          'A wide range of products from leading global brands'
        ),
      },
      'why-us': {
        tag: this.L('قيمنا', 'Our values'),
        title: this.L('لماذا تختار الاتحاد؟', 'Why choose Al-Ittihad?'),
        subtitle: this.L(
          'قيم راسخة تجعلنا شريكك الأمثل في التجارة الدولية',
          'Solid values that make us your ideal partner in international trade'
        ),
      },
      news: {
        tag: this.L('الأخبار', 'News'),
        title: this.L('آخر أخبارنا', 'Latest news'),
        subtitle: this.L(
          'تابع آخر التطورات والإنجازات',
          'Follow our latest updates and achievements'
        ),
      },
      contact: {
        tag: this.t('nav.contact'),
        title: this.L('نحن هنا لمساعدتك', 'We are here to help'),
        subtitle: this.L(
          'تواصل معنا للحصول على أفضل الحلول اللوجستية',
          'Contact us for the best logistics solutions'
        ),
      },
      gallery: {
        tag: this.L('معرض الصور', 'Photo gallery'),
        title: this.L('معرض أعمالنا', 'Our work gallery'),
        subtitle: this.L(
          'لمحة عن خدماتنا وعملياتنا اللوجستية',
          'A look at our services and logistics operations'
        ),
      },
      login: {
        tag: this.t('nav.login'),
        title: this.L('مرحباً بعودتك', 'Welcome back'),
        subtitle: this.L(
          'سجّل دخولك للوصول إلى حسابك',
          'Sign in to access your account'
        ),
      },
    };
    return heroes[key] ?? { tag: '', title: '', subtitle: '' };
  }

  getAboutContent(): AboutPageContent {
    return {
      intro: [
        this.L(
          'الاتحاد التجارية للاستيراد والتصدير… جودة تثق بها، وشراكة تمتد إلى العالم.',
          'Al-Ittihad Trading for import and export… quality you trust, and a partnership that reaches the world.'
        ),
        this.L(
          'إحدى الشركات الرائدة في مجال الاستيراد والتصدير والشحن والتخليص الجمركي، حيث نلتزم بتوفير منتجات وخدمات عالية الجودة تلبي تطلعات عملائنا في مختلف الأسواق محلياً وإقليمياً وعالمياً.',
          'A leading company in import, export, shipping and customs clearance, committed to high-quality products and services that meet client expectations across local, regional and global markets.'
        ),
      ],
      goal: {
        title: this.L('الهدف', 'Our goal'),
        description: this.L(
          'نسعى إلى توفير حلول متكاملة للاستيراد والتصدير والشحن والتخليص الجمركي بأعلى معايير الجودة والكفاءة، بما يضمن رضا العملاء وتعزيز الثقة المتبادلة مع شركائنا حول العالم.',
          'We aim to deliver integrated import, export, shipping and customs solutions at the highest standards of quality and efficiency — ensuring client satisfaction and mutual trust with partners worldwide.'
        ),
        image:
          'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80',
      },
      vision: {
        title: this.L('الرؤية', 'Vision'),
        items: [
          this.L(
            'التوسع في أسواق الشرق الأوسط والأسواق الدولية الواعدة',
            'Expand across the Middle East and promising international markets'
          ),
          this.L(
            'تعزيز مكانة الشركة كجهة موثوقة في الاستيراد والتصدير والشحن',
            'Strengthen our position as a trusted partner in import, export and shipping'
          ),
          this.L(
            'بناء علاقات وشراكات تجارية طويلة الأمد مع العملاء والموزعين',
            'Build long-term trade relationships with clients and distributors'
          ),
          this.L(
            'الالتزام بأعلى معايير الجودة والسلامة في جميع العمليات',
            'Uphold the highest quality and safety standards in every operation'
          ),
          this.L(
            'تقديم أسعار تنافسية وخدمات احترافية تلبي احتياجات العملاء',
            'Offer competitive pricing and professional services that meet client needs'
          ),
          this.L(
            'تحقيق نمو مستدام وزيادة حجم العمليات عامًا بعد عام',
            'Achieve sustainable growth and expand operations year after year'
          ),
          this.L(
            'مواكبة متطلبات الأسواق العالمية وتطوير الخدمات بما يتناسب مع احتياجات العملاء',
            'Keep pace with global market requirements and evolve services to match client needs'
          ),
        ],
      },
      stats: [
        {
          value: 10,
          prefix: '+',
          suffix: '',
          label: this.L('سنوات خبرة', 'Years of experience'),
        },
        {
          value: 50,
          prefix: '+',
          suffix: '',
          label: this.L('شريك تجاري', 'Trade partners'),
        },
        {
          value: 100,
          prefix: '+',
          suffix: '',
          label: this.L('منتج متنوع', 'Diverse products'),
        },
        {
          value: 15,
          prefix: '+',
          suffix: '',
          label: this.L('سوق عالمي', 'Global markets'),
        },
      ],
      phones: ['01050302172', '01210077500'],
    };
  }

  getBrandSection(): {
    subtitle: string;
    paragraphs: string[];
    highlight: string;
    image: string;
    cards: BrandCard[];
  } {
    return {
      subtitle: this.L(
        'حوّل فكرتك إلى علامة تجارية ناجحة',
        'Turn your idea into a successful brand'
      ),
      paragraphs: [
        this.L(
          'تمكين الشركات ورواد الأعمال من إنشاء علاماتهم التجارية الخاصة عبر تقديم خدمات التصنيع للغير بجودة متميزة، وأسعار تنافسية، وحلول متكاملة تبدأ من الفكرة وحتى وصول المنتج النهائي إلى السوق.',
          'Empowering companies and entrepreneurs to create their own brands through private-label manufacturing — with outstanding quality, competitive pricing, and end-to-end solutions from idea to market.'
        ),
      ],
      highlight: this.L(
        'نقدم حلولًا متكاملة في التصنيع للغير، والاستيراد والتصدير، لنمنح علامتك التجارية بداية قوية ومستقبلًا واعدًا.',
        'We offer integrated private-label, import and export solutions to give your brand a strong start and a promising future.'
      ),
      image:
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=900&q=70',
      cards: [
        {
          title: this.L('تطوير المنتج', 'Product development'),
          items: [
            this.L('دراسة الفكرة', 'Idea study'),
            this.L('اختيار التركيبة المناسبة', 'Choose the right formula'),
            this.L(
              'تطوير المنتج بما يتوافق مع احتياجات السوق',
              'Develop the product to match market needs'
            ),
          ],
          icon: this.icon(
            `<path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>`
          ),
        },
        {
          title: this.L('تصميم الهوية والتغليف', 'Identity & packaging design'),
          items: [
            this.L('تصميم العبوات', 'Packaging design'),
            this.L('تصميم اللوجو والهوية', 'Logo and brand identity'),
            this.L('تجهيز ملفات الطباعة', 'Print-ready files'),
          ],
          icon: this.icon(
            `<path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>`
          ),
        },
        {
          title: this.L('التصنيع والجودة', 'Manufacturing & quality'),
          items: [
            this.L('تصنيع وفق أعلى معايير الجودة', 'Manufacturing to top quality standards'),
            this.L('فحص المنتج', 'Product inspection'),
            this.L('تعبئة وتغليف احترافي', 'Professional packing and packaging'),
          ],
          icon: this.icon(
            `<path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>`
          ),
        },
        {
          title: this.L('التسليم والدعم', 'Delivery & support'),
          items: [
            this.L('تجهيز المنتج النهائي', 'Final product preparation'),
            this.L('خدمات الشحن', 'Shipping services'),
            this.L(
              'دعم مستمر لتطوير العلامة التجارية',
              'Ongoing support to grow your brand'
            ),
          ],
          icon: this.icon(
            `<path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>`
          ),
        },
      ],
    };
  }

  getGalleryImages(): GalleryImage[] {
    return [
      {
        src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=70',
        alt: this.L('مستودعات الشحن', 'Shipping warehouses'),
        category: this.L('لوجستيات', 'Logistics'),
      },
      {
        src: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=70',
        alt: this.L('الشحن الدولي', 'International shipping'),
        category: this.L('شحن', 'Shipping'),
      },
      {
        src: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=70',
        alt: this.L('التخزين والتوزيع', 'Storage and distribution'),
        category: this.L('مستودعات', 'Warehouses'),
      },
      {
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=70',
        alt: this.L('منتجات استهلاكية', 'Consumer products'),
        category: this.L('منتجات', 'Products'),
      },
      {
        src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70',
        alt: this.L('مواد غذائية', 'Food products'),
        category: this.L('غذاء', 'Food'),
      },
      {
        src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=70',
        alt: this.L('خطوط الإنتاج', 'Production lines'),
        category: this.L('تصنيع', 'Manufacturing'),
      },
    ];
  }

  getWhyUsValues(): ServiceItem[] {
    return [
      {
        title: this.L('جودة عالية', 'High quality'),
        description: this.L(
          'نلتزم بتوفير منتجات عالية الجودة تلبي أعلى المعايير العالمية في الغذاء والتجميل',
          'We are committed to providing high-quality products that meet the highest international standards in food and beauty'
        ),
        icon: this.icon(
          `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`
        ),
      },
      {
        title: this.L('ثقة وموثوقية', 'Trust & reliability'),
        description: this.L(
          'شراكة تجارية موثوقة تمتد إلى أسواق متعددة حول العالم',
          'A reliable business partnership extending across multiple markets worldwide'
        ),
        icon: this.icon(
          `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`
        ),
      },
      {
        title: this.L('وصول عالمي', 'Global reach'),
        description: this.L(
          'شبكة واسعة من العملاء والموزعين في الشرق الأوسط والعالم',
          'A wide network of clients and distributors across the Middle East and the world'
        ),
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`
        ),
      },
      {
        title: this.L('دعم متواصل', 'Continuous support'),
        description: this.L(
          'فريق متخصص لدعمكم على مدار الساعة لضمان رضاكم التام',
          'A specialized team supporting you around the clock to ensure your complete satisfaction'
        ),
        icon: this.icon(
          `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9a2 2 0 0 1-2 2H7l-2 2V7a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z"/>`
        ),
      },
    ];
  }

  getSteps(): StepItem[] {
    return [
      {
        order: '01',
        title: this.L('تقديم الطلب', 'Submit request'),
        description: this.L(
          'تواصل معنا وقدّم تفاصيل احتياجاتك',
          'Contact us and share your requirements'
        ),
        emoji: '📋',
      },
      {
        order: '02',
        title: this.L('تجهيز الطلب', 'Order preparation'),
        description: this.L(
          'تجهيز وفحص البضائع وفق معايير الجودة',
          'Prepare and inspect goods to quality standards'
        ),
        emoji: '📦',
      },
      {
        order: '03',
        title: this.L('الشحن', 'Shipping'),
        description: this.L(
          'شحن آمن وسريع بأفضل وسائل النقل',
          'Safe, fast shipping via the best transport modes'
        ),
        emoji: '🚢',
      },
      {
        order: '04',
        title: this.L('التخليص الجمركي', 'Customs clearance'),
        description: this.L(
          'إنهاء كل الإجراءات الجمركية في وقت قياسي',
          'Complete all customs procedures in record time'
        ),
        emoji: '🚚',
      },
      {
        order: '05',
        title: this.L('التسليم', 'Delivery'),
        description: this.L(
          'تسليم في الوقت المحدد أينما كنت',
          'On-time delivery wherever you are'
        ),
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
        label: this.L('رضا عملائنا', 'Client satisfaction'),
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`
        ),
      },
      {
        value: 24,
        prefix: '',
        suffix: '/7',
        label: this.L('دعم متواصل', 'Continuous support'),
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`
        ),
      },
      {
        value: 120,
        prefix: '+',
        suffix: '',
        label: this.L('دولة حول العالم', 'Countries worldwide'),
        icon: this.icon(
          `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`
        ),
      },
      {
        value: 2500,
        prefix: '+',
        suffix: '',
        label: this.L('شحنة سنويًا', 'Shipments per year'),
        icon: this.icon(
          `<path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>`
        ),
      },
    ];
  }

  getProductCategories(): ProductCategory[] {
    return [
      {
        title: this.L('هواتف وأجهزة سامسونج', 'Samsung phones & devices'),
        subtitle: this.L('إلكترونيات', 'Electronics'),
        brand: 'SAMSUNG',
        image:
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('شاشات وتلفزيونات سامسونج', 'Samsung screens & TVs'),
        subtitle: this.L('إلكترونيات', 'Electronics'),
        brand: 'SAMSUNG',
        image:
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('منتجات نستله الغذائية', 'Nestlé food products'),
        subtitle: this.L('مواد غذائية', 'Food products'),
        brand: 'Nestlé',
        image:
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('مشروبات وألبان نستله', 'Nestlé drinks & dairy'),
        subtitle: this.L('مواد غذائية', 'Food products'),
        brand: 'Nestlé',
        image:
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('منتجات يونيليفر للعناية', 'Unilever care products'),
        subtitle: this.L('استهلاكية', 'Consumer goods'),
        brand: 'Unilever',
        image:
          'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('منظفات يونيليفر', 'Unilever detergents'),
        subtitle: this.L('استهلاكية', 'Consumer goods'),
        brand: 'Unilever',
        image:
          'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('أجهزة بوش المنزلية', 'Bosch home appliances'),
        subtitle: this.L('معدات كهربائية', 'Electrical equipment'),
        brand: 'BOSCH',
        image:
          'https://images.unsplash.com/photo-1556911220-bff31c812dce?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('عدد وأدوات بوش', 'Bosch tools'),
        subtitle: this.L('صناعية', 'Industrial'),
        brand: 'BOSCH',
        image:
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('منتجات P&G للعناية الشخصية', 'P&G personal care'),
        subtitle: this.L('استهلاكية', 'Consumer goods'),
        brand: 'P&G',
        image:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('منظفات P&G', 'P&G detergents'),
        subtitle: this.L('استهلاكية', 'Consumer goods'),
        brand: 'P&G',
        image:
          'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('أجهزة فيليبس المنزلية', 'Philips home appliances'),
        subtitle: this.L('إلكترونيات', 'Electronics'),
        brand: 'PHILIPS',
        image:
          'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('إضاءة فيليبس', 'Philips lighting'),
        subtitle: this.L('معدات كهربائية', 'Electrical equipment'),
        brand: 'PHILIPS',
        image:
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('أجهزة LG المنزلية', 'LG home appliances'),
        subtitle: this.L('إلكترونيات', 'Electronics'),
        brand: 'LG',
        image:
          'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('شاشات LG', 'LG screens'),
        subtitle: this.L('إلكترونيات', 'Electronics'),
        brand: 'LG',
        image:
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('مشروبات كوكا كولا', 'Coca-Cola beverages'),
        subtitle: this.L('مواد غذائية', 'Food products'),
        brand: 'Coca-Cola',
        image:
          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=70',
      },
      {
        title: this.L('منتجات كوكا كولا المتنوعة', 'Coca-Cola product range'),
        subtitle: this.L('مواد غذائية', 'Food products'),
        brand: 'Coca-Cola',
        image:
          'https://images.unsplash.com/photo-1596803244618-8dcee15344d2?auto=format&fit=crop&w=800&q=70',
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
