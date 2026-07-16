import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceItem } from '../../../../core/models/site.models';
import { LanguageService } from '../../../../core/services/language.service';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.component.html',
  styleUrls: ['./services-section.component.scss'],
})
export class ServicesSectionComponent implements OnDestroy {
  services: ServiceItem[] = [];
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.refresh();
    this.sub = this.lang.lang$.subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private refresh(): void {
    this.services = this.siteData.getServices();
  }
}
