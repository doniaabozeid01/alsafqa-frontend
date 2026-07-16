import { Component } from '@angular/core';
import { GalleryImage } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  hero = this.siteData.getPageHero('gallery');
  images: GalleryImage[] = this.siteData.getGalleryImages();
  lightboxSrc: string | null = null;

  constructor(private siteData: SiteDataService) {}

  openLightbox(src: string): void {
    this.lightboxSrc = src;
  }

  closeLightbox(): void {
    this.lightboxSrc = null;
  }
}
