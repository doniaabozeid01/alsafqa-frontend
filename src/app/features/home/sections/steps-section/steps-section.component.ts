import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StepItem } from '../../../../core/models/site.models';
import { LanguageService } from '../../../../core/services/language.service';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-steps-section',
  templateUrl: './steps-section.component.html',
  styleUrls: ['./steps-section.component.scss'],
})
export class StepsSectionComponent implements OnDestroy {
  steps: StepItem[] = [];
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
    this.steps = this.siteData.getSteps();
  }
}
