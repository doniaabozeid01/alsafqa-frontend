import { Component } from '@angular/core';
import { StepItem } from '../../../../core/models/site.models';
import { SiteDataService } from '../../../../core/services/site-data.service';

@Component({
  selector: 'app-steps-section',
  templateUrl: './steps-section.component.html',
  styleUrls: ['./steps-section.component.scss'],
})
export class StepsSectionComponent {
  steps: StepItem[] = this.siteData.getSteps();

  constructor(private siteData: SiteDataService) {}
}
