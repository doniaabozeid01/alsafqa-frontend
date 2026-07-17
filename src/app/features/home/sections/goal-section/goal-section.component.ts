import { Component } from '@angular/core';

@Component({
  selector: 'app-goal-section',
  templateUrl: './goal-section.component.html',
  styleUrls: ['./goal-section.component.scss'],
})
export class GoalSectionComponent {
  readonly features = ['home.goal.f1', 'home.goal.f2', 'home.goal.f3'] as const;
}
