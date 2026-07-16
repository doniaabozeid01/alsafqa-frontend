import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showLayout = true;
  showSplash = true;

  constructor(
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.init();
    this.updateLayout(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.updateLayout(url);
      });
  }

  onSplashClosed(): void {
    this.showSplash = false;
  }

  private updateLayout(url: string): void {
    this.showLayout = !url.startsWith('/login') && !url.startsWith('/dashboard');
  }
}
