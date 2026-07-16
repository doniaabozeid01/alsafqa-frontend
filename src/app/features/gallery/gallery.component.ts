import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GalleryDto } from '../../core/models/api.models';
import { GalleriesService } from '../../core/services/galleries.service';
import { LanguageService } from '../../core/services/language.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
  hero = this.siteData.getPageHero('gallery');
  items: GalleryDto[] = [];
  lightboxSrc: string | null = null;
  private langSub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private galleriesService: GalleriesService,
    private lang: LanguageService
  ) {
    this.langSub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('gallery');
    });
  }

  ngOnInit(): void {
    this.galleriesService.getAll().subscribe({
      next: (items) => {
        this.items = items;
      },
      error: () => {
        this.items = [];
      },
    });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  itemTitle(item: GalleryDto): string {
    return this.lang.localized(item.titleAr, item.titleEn);
  }

  itemImage(item: GalleryDto): string {
    return item.imageUrl || 'assets/placeholders/no-image.svg';
  }

  itemCategory(item: GalleryDto): string {
    return this.lang.localized(item.categoryNameAr, item.categoryNameEn);
  }

  openLightbox(src: string): void {
    if (!src) return;
    this.lightboxSrc = src;
  }

  closeLightbox(): void {
    this.lightboxSrc = null;
  }
}
