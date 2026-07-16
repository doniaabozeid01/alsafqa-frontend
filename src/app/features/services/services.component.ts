import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceItem } from '../../core/models/site.models';
import { LanguageService } from '../../core/services/language.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnDestroy {
  hero = this.siteData.getPageHero('services');
  services: ServiceItem[] = this.siteData.getServices();
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.sub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('services');
      this.services = this.siteData.getServices();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
