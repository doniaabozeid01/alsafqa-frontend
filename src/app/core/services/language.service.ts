import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TRANSLATIONS, TranslationKey } from '../i18n/translations';

export type AppLang = 'ar' | 'en';

const STORAGE_KEY = 'alsafqa_lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly langSubject = new BehaviorSubject<AppLang>(this.readStored());
  readonly lang$ = this.langSubject.asObservable();

  constructor() {
    this.applyDocument(this.langSubject.value);
  }

  get current(): AppLang {
    return this.langSubject.value;
  }

  get isRtl(): boolean {
    return this.current === 'ar';
  }

  /** Opposite label for the switch button */
  get switchLabel(): string {
    return this.current === 'ar' ? 'EN' : 'عربي';
  }

  setLang(lang: AppLang): void {
    if (lang === this.current) return;
    localStorage.setItem(STORAGE_KEY, lang);
    this.langSubject.next(lang);
    this.applyDocument(lang);
  }

  toggle(): void {
    this.setLang(this.current === 'ar' ? 'en' : 'ar');
  }

  t(key: TranslationKey | string): string {
    const table = TRANSLATIONS[this.current] || TRANSLATIONS.ar;
    return table[key as TranslationKey] || TRANSLATIONS.ar[key as TranslationKey] || key;
  }

  /** Prefer current language field, fall back to the other. */
  localized(ar?: string | null, en?: string | null): string {
    const a = (ar || '').trim();
    const e = (en || '').trim();
    if (this.current === 'en') return e || a;
    return a || e;
  }

  private readStored(): AppLang {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'en' ? 'en' : 'ar';
  }

  private applyDocument(lang: AppLang): void {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
