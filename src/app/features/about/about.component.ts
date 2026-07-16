import { Component } from '@angular/core';
import { AboutPageContent, ContactInfo, PageHero } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  hero: PageHero = this.siteData.getPageHero('about');
  content: AboutPageContent = this.siteData.getAboutContent();
  contact: ContactInfo = this.siteData.getContactInfo();

  constructor(private siteData: SiteDataService) {}
}
