import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactInfo } from '../../core/models/site.models';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  hero = this.siteData.getPageHero('contact');
  contact: ContactInfo = this.siteData.getContactInfo();
  form: FormGroup;
  submitted = false;

  constructor(
    private siteData: SiteDataService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted = true;
    this.form.reset();
  }
}
