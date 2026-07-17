import { Component } from '@angular/core';

@Component({
  selector: 'app-vision-section',
  templateUrl: './vision-section.component.html',
  styleUrls: ['./vision-section.component.scss'],
})
export class VisionSectionComponent {
  readonly items = [
    { key: 'home.vision.1' },
    { key: 'home.vision.2' },
    { key: 'home.vision.3' },
    { key: 'home.vision.4' },
    { key: 'home.vision.5' },
    { key: 'home.vision.6' },
    { key: 'home.vision.7' },
  ] as const;

  pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
