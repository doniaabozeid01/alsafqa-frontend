import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactInfo } from '../../core/models/site.models';
import { ContactMessagesService } from '../../core/services/contact-messages.service';
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
  sending = false;
  errorMessage: string | null = null;

  constructor(
    private siteData: SiteDataService,
    private contactMessages: ContactMessagesService,
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
          this.errorMessage = 'تعذر إرسال الرسالة. تأكد من تشغيل السيرفر وحاول مرة أخرى.';
        },
      });
  }
}
