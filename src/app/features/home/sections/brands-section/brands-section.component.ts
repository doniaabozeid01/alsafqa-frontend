import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BrandDto } from '../../../../core/models/api.models';
import { BrandsService } from '../../../../core/services/brands.service';

@Component({
  selector: 'app-brands-section',
  templateUrl: './brands-section.component.html',
  styleUrls: ['./brands-section.component.scss'],
})
export class BrandsSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('marquee') marqueeRef?: ElementRef<HTMLElement>;
  @ViewChild('track') trackRef?: ElementRef<HTMLElement>;

  brands: BrandDto[] = [];
  loopBrands: BrandDto[] = [];
  marqueeGroups = [0, 1];

  dragging = false;

  private offset = 0;
  private halfWidth = 0;
  private speed = 90;
  private hoverPaused = false;
  private rafId = 0;
  private lastTs = 0;
  private pointerId: number | null = null;
  private startX = 0;
  private startOffset = 0;
  private didDrag = false;
  private started = false;
  private resizeObserver?: ResizeObserver;
  private readonly dragThreshold = 12;

  constructor(
    private brandsService: BrandsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.loopBrands = this.buildLoopBrands(brands);
        this.speed = Math.min(130, Math.max(85, 70 + brands.length * 2.5));
        this.cdr.detectChanges();
        this.startMarquee();
      },
      error: () => {
        this.brands = [];
        this.loopBrands = [];
      },
    });
  }

  ngAfterViewInit(): void {
    this.startMarquee();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  brandLabel(brand: BrandDto): string {
    return brand.nameAr || brand.nameEn;
  }

  openBrand(brand: BrandDto, event: Event): void {
    if (this.didDrag || this.dragging) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    this.router.navigate(['/products'], { queryParams: { brandId: brand.id } });
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startOffset = this.offset;
    this.didDrag = false;
    this.dragging = false;
  }

  onPointerMove(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) return;

    const dx = event.clientX - this.startX;

    if (!this.dragging && Math.abs(dx) > this.dragThreshold) {
      this.dragging = true;
      this.didDrag = true;
      this.marqueeRef?.nativeElement.setPointerCapture(event.pointerId);
    }

    if (!this.dragging) return;

    this.offset = this.wrap(this.startOffset + dx);
    this.applyTransform();
  }

  onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;

    const wasDragging = this.dragging;
    this.dragging = false;
    this.pointerId = null;

    try {
      this.marqueeRef?.nativeElement.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }

    if (wasDragging) {
      // Block the synthetic click that follows a drag
      setTimeout(() => {
        this.didDrag = false;
      }, 120);
    }
  }

  onMouseEnter(): void {
    this.hoverPaused = true;
  }

  onMouseLeave(): void {
    this.hoverPaused = false;
    this.dragging = false;
    this.pointerId = null;
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.dragging = false;
    this.pointerId = null;
  }

  private startMarquee(): void {
    if (this.started || !this.brands.length) return;

    requestAnimationFrame(() => {
      if (this.started || !this.trackRef) return;
      this.started = true;
      this.measure();
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.trackRef.nativeElement);
      this.lastTs = 0;
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    });
  }

  private tick(ts: number): void {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min(0.05, (ts - this.lastTs) / 1000);
    this.lastTs = ts;

    const reduceMotion =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.dragging && !this.hoverPaused && !reduceMotion && this.halfWidth > 0) {
      this.offset = this.wrap(this.offset - this.speed * dt);
      this.applyTransform();
    }

    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  private measure(): void {
    const track = this.trackRef?.nativeElement;
    if (!track) return;
    const group = track.querySelector('.marquee-group') as HTMLElement | null;
    this.halfWidth = group?.offsetWidth || track.scrollWidth / 2;
    this.offset = this.wrap(this.offset);
    this.applyTransform();
  }

  private wrap(value: number): number {
    if (this.halfWidth <= 0) return value;
    let v = value % this.halfWidth;
    if (v > 0) v -= this.halfWidth;
    return v;
  }

  private applyTransform(): void {
    const track = this.trackRef?.nativeElement;
    if (!track) return;
    track.style.transform = `translate3d(${this.offset}px, 0, 0)`;
  }

  private buildLoopBrands(brands: BrandDto[]): BrandDto[] {
    if (!brands.length) return [];
    let list = [...brands];
    while (list.length < 10) {
      list = [...list, ...brands];
    }
    return list;
  }
}
