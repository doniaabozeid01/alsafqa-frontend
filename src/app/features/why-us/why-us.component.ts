import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceItem, StatItem } from '../../core/models/site.models';
import { LanguageService } from '../../core/services/language.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.scss'],
})
export class WhyUsComponent implements OnDestroy {
  hero = this.siteData.getPageHero('why-us');
  values: ServiceItem[] = this.siteData.getWhyUsValues();
  stats: StatItem[] = this.siteData.getStats();
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.sub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('why-us');
      this.values = this.siteData.getWhyUsValues();
      this.stats = this.siteData.getStats();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
