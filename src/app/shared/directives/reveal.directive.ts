import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

/**
 * Reveals an element with an animation when it enters the viewport.
 *
 * Usage:
 *   <div appReveal>                      → fade up (default)
 *   <div appReveal="left">               → slide from left
 *   <div appReveal="zoom" [revealDelay]="200">
 *
 * Variants: up | down | left | right | zoom | flip
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input('appReveal') variant: string = 'up';
  @Input() revealDelay = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    this.renderer.setAttribute(element, 'data-reveal', this.variant || 'up');
    this.renderer.setStyle(element, '--reveal-delay', `${this.revealDelay}ms`, 2);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(element, 'revealed');
            this.observer?.unobserve(element);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
