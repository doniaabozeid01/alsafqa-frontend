import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StatItem } from '../../../../core/models/site.models';
import { LanguageService } from '../../../../core/services/language.service';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss'],
})
export class StatsSectionComponent implements OnDestroy {
  stats: StatItem[] = [];
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
    this.stats = this.siteData.getStats();
  }
}
