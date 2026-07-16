import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WhyUsComponent } from './why-us.component';

const routes: Routes = [{ path: '', component: WhyUsComponent }];

@NgModule({
  declarations: [WhyUsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class WhyUsModule {}
