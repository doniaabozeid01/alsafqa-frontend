import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../core/services/language.service';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-brand-section',
  templateUrl: './brand-section.component.html',
  styleUrls: ['./brand-section.component.scss'],
})
export class BrandSectionComponent implements OnDestroy {
  brand = this.siteData.getBrandSection();
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.sub = this.lang.lang$.subscribe(() => {
      this.brand = this.siteData.getBrandSection();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
