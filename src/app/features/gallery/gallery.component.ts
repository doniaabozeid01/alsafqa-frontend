import { Component, OnInit } from '@angular/core';
import { GalleryDto } from '../../core/models/api.models';
import { GalleriesService } from '../../core/services/galleries.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  hero = this.siteData.getPageHero('gallery');
  items: GalleryDto[] = [];
  lightboxSrc: string | null = null;

  constructor(
    private siteData: SiteDataService,
    private galleriesService: GalleriesService
  ) {}

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

  itemTitle(item: GalleryDto): string {
    return item.titleAr || item.titleEn;
  }

  itemImage(item: GalleryDto): string {
    return item.imageUrl || 'assets/placeholders/no-image.svg';
  }

  itemCategory(item: GalleryDto): string {
    return item.categoryNameAr || item.categoryNameEn;
  }

  openLightbox(src: string): void {
    if (!src) return;
    this.lightboxSrc = src;
  }

  closeLightbox(): void {
    this.lightboxSrc = null;
  }
}
