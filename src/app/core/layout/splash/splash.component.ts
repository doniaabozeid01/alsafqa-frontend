import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<void>();

  visible = true;
  leaving = false;
  private timers: number[] = [];

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = reduce ? 900 : 3600;
    const fade = reduce ? 350 : 700;

    this.timers.push(
      window.setTimeout(() => {
        this.leaving = true;
      }, hold)
    );

    this.timers.push(
      window.setTimeout(() => {
        this.finish();
      }, hold + fade)
    );
  }

  ngOnDestroy(): void {
    this.timers.forEach((id) => clearTimeout(id));
    document.body.style.overflow = '';
  }

  skip(): void {
    this.leaving = true;
    this.timers.push(window.setTimeout(() => this.finish(), 420));
  }

  private finish(): void {
    document.body.style.overflow = '';
    this.visible = false;
    this.closed.emit();
  }
}
