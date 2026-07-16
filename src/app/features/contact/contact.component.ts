import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContactInfo } from '../../core/models/site.models';
import { ContactMessagesService } from '../../core/services/contact-messages.service';
import { LanguageService } from '../../core/services/language.service';
import { SiteDataService } from '../../core/services/site-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnDestroy {
  hero = this.siteData.getPageHero('contact');
  contact: ContactInfo = this.siteData.getContactInfo();
  form: FormGroup;
  submitted = false;
  sending = false;
  errorMessage: string | null = null;
  private sub: Subscription;

  constructor(
    private siteData: SiteDataService,
    private contactMessages: ContactMessagesService,
    private fb: FormBuilder,
    private lang: LanguageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
    this.sub = this.lang.lang$.subscribe(() => {
      this.hero = this.siteData.getPageHero('contact');
      this.contact = this.siteData.getContactInfo();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSubmit(): void {
    if (this.sending) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted = false;
    this.errorMessage = null;
    this.sending = true;

    const { name, email, phone, message } = this.form.getRawValue();

    this.contactMessages
      .send({
        fullName: name,
        email,
        phone,
        subject: 'رسالة تواصل من الموقع',
        message,
      })
      .subscribe({
        next: () => {
          this.sending = false;
          this.submitted = true;
          this.form.reset();
        },
        error: () => {
          this.sending = false;
          this.errorMessage = this.lang.t('contact.error');
        },
      });
  }
}
