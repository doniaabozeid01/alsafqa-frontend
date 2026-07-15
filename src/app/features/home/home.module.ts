import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ServicesSectionComponent } from './sections/services-section/services-section.component';
import { StepsSectionComponent } from './sections/steps-section/steps-section.component';
import { StatsSectionComponent } from './sections/stats-section/stats-section.component';
import { ProductsSectionComponent } from './sections/products-section/products-section.component';
import { BrandsSectionComponent } from './sections/brands-section/brands-section.component';
import { CtaSectionComponent } from './sections/cta-section/cta-section.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    ServicesSectionComponent,
    StepsSectionComponent,
    StatsSectionComponent,
    ProductsSectionComponent,
    BrandsSectionComponent,
    CtaSectionComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
