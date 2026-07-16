import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showLayout = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateLayout(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.updateLayout(url);
      });
  }

  private updateLayout(url: string): void {
    this.showLayout = !url.startsWith('/login') && !url.startsWith('/dashboard');
  }
}
