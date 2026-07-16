import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RevealDirective } from './directives/reveal.directive';
import { CountUpDirective } from './directives/count-up.directive';
import { PageHeroComponent } from './components/page-hero/page-hero.component';

@NgModule({
  declarations: [RevealDirective, CountUpDirective, PageHeroComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RevealDirective,
    CountUpDirective,
    PageHeroComponent,
  ],
})
export class SharedModule {}
