import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NewsComponent } from './news.component';

const routes: Routes = [{ path: '', component: NewsComponent }];

@NgModule({
  declarations: [NewsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class NewsModule {}
