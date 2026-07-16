import { Component } from '@angular/core';

@Component({
  selector: 'app-goal-section',
  templateUrl: './goal-section.component.html',
  styleUrls: ['./goal-section.component.scss'],
})
export class GoalSectionComponent {
  readonly image =
    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80';

  readonly features = ['home.goal.f1', 'home.goal.f2', 'home.goal.f3'] as const;
}
