import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

/**
 * Animates a number from 0 to a target value when the element becomes visible.
 *
 * Usage:
 *   <span appCountUp [countTo]="2500" prefix="+"></span>
 *   <span appCountUp [countTo]="98" prefix="+" suffix="%"></span>
 */
@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input() countTo = 0;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() duration = 2000;

  private observer?: IntersectionObserver;
  private frameId?: number;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.render(0);
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.animate();
            this.observer?.unobserve(this.el.nativeElement);
          }
        }
      },
      { threshold: 0.4 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  private animate(): void {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / this.duration, 1);
      // ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      this.render(Math.round(this.countTo * eased));
      if (progress < 1) {
        this.frameId = requestAnimationFrame(tick);
      }
    };
    this.frameId = requestAnimationFrame(tick);
  }

  private render(value: number): void {
    this.el.nativeElement.textContent = `${this.prefix}${value.toLocaleString('en-US')}${this.suffix}`;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
