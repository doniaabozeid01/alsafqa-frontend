import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewsItem } from '../../core/models/site.models';
import { LanguageService } from '../../core/services/language.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnDestroy {
  hero = this.siteData.getPageHero('news');
  news: NewsItem[] = this.siteData.getNews();
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private lang: LanguageService
  ) {
    this.sub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('news');
      this.news = this.siteData.getNews();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
