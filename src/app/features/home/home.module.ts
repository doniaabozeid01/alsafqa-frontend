import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ServicesSectionComponent } from './sections/services-section/services-section.component';
import { BrandSectionComponent } from './sections/brand-section/brand-section.component';
import { JourneySectionComponent } from './sections/journey-section/journey-section.component';
import { StatsSectionComponent } from './sections/stats-section/stats-section.component';
import { ProductsSectionComponent } from './sections/products-section/products-section.component';
import { BrandsSectionComponent } from './sections/brands-section/brands-section.component';
import { AboutSectionComponent } from './sections/about-section/about-section.component';
import { GoalSectionComponent } from './sections/goal-section/goal-section.component';
import { VisionSectionComponent } from './sections/vision-section/vision-section.component';
import { CtaSectionComponent } from './sections/cta-section/cta-section.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    ServicesSectionComponent,
    BrandSectionComponent,
    JourneySectionComponent,
    StatsSectionComponent,
    ProductsSectionComponent,
    BrandsSectionComponent,
    AboutSectionComponent,
    GoalSectionComponent,
    VisionSectionComponent,
    CtaSectionComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
