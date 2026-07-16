import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RevealDirective } from './directives/reveal.directive';
import { CountUpDirective } from './directives/count-up.directive';
import { PageHeroComponent } from './components/page-hero/page-hero.component';
import { SearchableSelectComponent } from './components/searchable-select/searchable-select.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { LocalizedPipe } from './pipes/localized.pipe';

@NgModule({
  declarations: [
    RevealDirective,
    CountUpDirective,
    PageHeroComponent,
    SearchableSelectComponent,
    TranslatePipe,
    LocalizedPipe,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RevealDirective,
    CountUpDirective,
    PageHeroComponent,
    SearchableSelectComponent,
    TranslatePipe,
    LocalizedPipe,
  ],
})
export class SharedModule {}
