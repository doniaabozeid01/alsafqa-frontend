import { Component } from '@angular/core';

@Component({
  selector: 'app-vision-section',
  templateUrl: './vision-section.component.html',
  styleUrls: ['./vision-section.component.scss'],
})
export class VisionSectionComponent {
  readonly items = [
    'home.vision.1',
    'home.vision.2',
    'home.vision.3',
    'home.vision.4',
    'home.vision.5',
    'home.vision.6',
    'home.vision.7',
  ] as const;
}
