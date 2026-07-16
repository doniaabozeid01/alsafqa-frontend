import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { JourneyStep } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-journey-section',
  templateUrl: './journey-section.component.html',
  styleUrls: ['./journey-section.component.scss'],
})
export class JourneySectionComponent implements AfterViewInit, OnDestroy {
  steps: JourneyStep[] = this.siteData.getJourneySteps();

  @ViewChild('journey') journeyRef!: ElementRef<HTMLElement>;
  @ViewChild('journeySvg') svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('pathEl') pathElRef!: ElementRef<SVGPathElement>;
  @ViewChild('pathBg') pathBgRef!: ElementRef<SVGPathElement>;
  @ViewChild('dotsG') dotsGRef!: ElementRef<SVGGElement>;
  @ViewChild('tip') tipRef!: ElementRef<SVGCircleElement>;
  @ViewChildren('journeyItem') itemRefs!: QueryList<ElementRef<HTMLElement>>;

  private readonly svgNs = 'http://www.w3.org/2000/svg';
  private totalLen = 0;
  private anchors: number[] = [];
  private isDesktop = false;
  private current = 0;
  private target = 0;
  private animating = false;
  private rafId = 0;
  private scrollTicking = false;
  private reducedMotion = false;

  constructor(private siteData: SiteDataService) {}

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => this.buildPath(), 0);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.updateTarget();
      this.scrollTicking = false;
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.buildPath();
  }

  private buildPath(): void {
    const journey = this.journeyRef?.nativeElement;
    const pathEl = this.pathElRef?.nativeElement;
    const pathBg = this.pathBgRef?.nativeElement;
    const svg = this.svgRef?.nativeElement;
    const dotsG = this.dotsGRef?.nativeElement;
    const items = this.itemRefs?.toArray().map((r) => r.nativeElement) ?? [];

    if (!journey || !pathEl || !pathBg || !svg || !dotsG || !items.length) return;

    this.isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (!this.isDesktop || this.reducedMotion) {
      this.updateTarget();
      return;
    }

    const w = journey.offsetWidth;
    const h = journey.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const pts = items.map((it) => ({
      x: it.offsetLeft + it.offsetWidth / 2,
      top: it.offsetTop,
      bottom: it.offsetTop + it.offsetHeight,
    }));

    let d = `M ${pts[0].x} ${pts[0].bottom}`;
    this.anchors = [0];
    const tmp = document.createElementNS(this.svgNs, 'path');

    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const midY = (prev.bottom + cur.top) / 2;
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.top}`;
      tmp.setAttribute('d', d);
      this.anchors.push(tmp.getTotalLength());
    }

    pathEl.setAttribute('d', d);
    pathBg.setAttribute('d', d);
    this.totalLen = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${this.totalLen}`;
    pathEl.style.strokeDashoffset = `${this.totalLen - this.current}`;

    dotsG.innerHTML = '';
    this.anchors.forEach((len) => {
      const pt = pathEl.getPointAtLength(len);
      const c = document.createElementNS(this.svgNs, 'circle');
      c.setAttribute('cx', `${pt.x}`);
      c.setAttribute('cy', `${pt.y}`);
      c.setAttribute('r', '5');
      c.setAttribute('class', 'journey-anchor');
      dotsG.appendChild(c);
    });

    this.updateTarget();
  }

  private render(): void {
    const pathEl = this.pathElRef?.nativeElement;
    const tip = this.tipRef?.nativeElement;
    const dotsG = this.dotsGRef?.nativeElement;
    const items = this.itemRefs?.toArray().map((r) => r.nativeElement) ?? [];

    if (!pathEl || !tip || !dotsG) return;

    pathEl.style.strokeDashoffset = `${this.totalLen - this.current}`;

    if (this.current > 2 && this.current < this.totalLen - 2) {
      const p = pathEl.getPointAtLength(this.current);
      tip.setAttribute('cx', `${p.x}`);
      tip.setAttribute('cy', `${p.y}`);
      tip.setAttribute('opacity', '1');
    } else {
      tip.setAttribute('opacity', '0');
    }

    const dots = dotsG.children;
    const vh = window.innerHeight;
    for (let i = 0; i < items.length; i++) {
      const reachedByLine = this.target > 0 && this.current >= this.anchors[i] - 0.5;
      // Last step: reveal when it enters view so you don't scroll past waiting for the tip
      const isLast = i === items.length - 1;
      const lastVisible =
        isLast && items[i].getBoundingClientRect().top < vh * 0.78;

      if (reachedByLine || lastVisible) {
        items[i].classList.add('revealed');
        if (dots[i]) dots[i].classList.add('lit');
      }
    }
  }

  private tick = (): void => {
    const diff = this.target - this.current;
    if (Math.abs(diff) < 0.5) {
      this.current = this.target;
      this.render();
      this.animating = false;
      return;
    }
    this.current += diff * 0.05;
    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private startAnim(): void {
    if (!this.animating) {
      this.animating = true;
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private updateTarget(): void {
    const journey = this.journeyRef?.nativeElement;
    const items = this.itemRefs?.toArray().map((r) => r.nativeElement) ?? [];
    if (!journey || !items.length) return;

    const rect = journey.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (vh * 0.8 - rect.top) / rect.height));

    if (this.isDesktop && this.totalLen && !this.reducedMotion) {
      this.target = this.totalLen * progress;

      // When the last step is on screen, pull the line to its end at normal speed
      const lastIndex = items.length - 1;
      const lastRect = items[lastIndex].getBoundingClientRect();
      if (lastRect.top < vh * 0.78 && this.anchors[lastIndex] != null) {
        this.target = Math.max(this.target, this.anchors[lastIndex]);
      }

      this.startAnim();
    } else {
      items.forEach((item) => {
        if (item.getBoundingClientRect().top < vh * 0.88) {
          item.classList.add('revealed');
        }
      });
    }
  }
}
