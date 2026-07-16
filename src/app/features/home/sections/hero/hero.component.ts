import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';

interface HeroStat {
  countTo: number;
  prefix: string;
  suffix: string;
  label: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;

  stats: HeroStat[] = [
    { countTo: 120, prefix: '+', suffix: '', label: 'دولة' },
    { countTo: 2500, prefix: '+', suffix: '', label: 'شحنة سنوياً' },
    { countTo: 24, prefix: '', suffix: '/7', label: 'دعم متواصل' },
  ];

  particles = Array.from({ length: 10 }, (_, i) => ({
    left: `${(i * 23 + 8) % 92}%`,
    delay: `${(i * 1.1) % 6}s`,
    duration: `${6 + (i % 3)}s`,
    size: `${2 + (i % 2)}px`,
  }));

  tickerTags = [
    '● استيراد وتصدير',
    '● شحن دولي',
    '● تخليص جمركي',
    '● توريد عالمي',
    '● مستودعات حديثة',
    '● توصيل آمن',
  ];

  private parallaxX = 0;
  private parallaxY = 0;
  private rafId = 0;
  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.tickParallax();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.reducedMotion || !this.heroSection) return;
    const rect = this.heroSection.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.parallaxX = x;
    this.parallaxY = y;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.parallaxX = 0;
    this.parallaxY = 0;
  }

  private tickParallax(): void {
    const el = this.heroSection?.nativeElement;
    if (el && !this.reducedMotion) {
      const px = this.parallaxX * 18;
      const py = this.parallaxY * 12;
      el.style.setProperty('--px', `${px}px`);
      el.style.setProperty('--py', `${py}px`);
    }
    this.rafId = requestAnimationFrame(() => this.tickParallax());
  }
}
