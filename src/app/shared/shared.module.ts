import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from './directives/reveal.directive';
import { CountUpDirective } from './directives/count-up.directive';

@NgModule({
  declarations: [RevealDirective, CountUpDirective],
  imports: [CommonModule],
  exports: [CommonModule, RevealDirective, CountUpDirective],
})
export class SharedModule {}
