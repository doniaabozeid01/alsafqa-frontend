import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardHomeComponent } from './pages/home/dashboard-home.component';
import { DashboardMessagesComponent } from './pages/messages/dashboard-messages.component';
import { DashboardBrandsComponent } from './pages/brands/dashboard-brands.component';
import { DashboardProductsComponent } from './pages/products/dashboard-products.component';
import { DashboardGalleryCategoriesComponent } from './pages/gallery-categories/dashboard-gallery-categories.component';
import { DashboardGalleryComponent } from './pages/gallery/dashboard-gallery.component';
import { DashboardSettingsComponent } from './pages/settings/dashboard-settings.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'messages', component: DashboardMessagesComponent },
      { path: 'brands', component: DashboardBrandsComponent },
      { path: 'products', component: DashboardProductsComponent },
      { path: 'gallery-categories', component: DashboardGalleryCategoriesComponent },
      { path: 'gallery', component: DashboardGalleryComponent },
      { path: 'settings', component: DashboardSettingsComponent },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DashboardHomeComponent,
    DashboardMessagesComponent,
    DashboardBrandsComponent,
    DashboardProductsComponent,
    DashboardGalleryCategoriesComponent,
    DashboardGalleryComponent,
    DashboardSettingsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
