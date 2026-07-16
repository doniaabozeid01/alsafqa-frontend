import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AboutPageContent, ContactInfo, PageHero } from '../../core/models/site.models';
import { LanguageService } from '../../core/services/language.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnDestroy {
  hero: PageHero = this.siteData.getPageHero('about');
  content: AboutPageContent = this.siteData.getAboutContent();
  contact: ContactInfo = this.siteData.getContactInfo();
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.sub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('about');
      this.content = this.siteData.getAboutContent();
      this.contact = this.siteData.getContactInfo();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
