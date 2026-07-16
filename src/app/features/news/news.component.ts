import { Component } from '@angular/core';
import { NewsItem } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  hero = this.siteData.getPageHero('news');
  news: NewsItem[] = this.siteData.getNews();

  constructor(private siteData: SiteDataService) {}
}
