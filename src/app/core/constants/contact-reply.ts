/** Fixed reply template sent with WhatsApp / email from the admin inbox */
export const CONTACT_REPLY_MESSAGE = `شكرًا لتواصلكم مع شركة الاتحاد التجارية للاستيراد والتصدير.

تم استلام رسالتكم بنجاح، وسيقوم فريقنا بمراجعة استفساركم والتواصل معكم في أقرب وقت ممكن.

نقدّر ثقتكم بنا، ونتطلع لخدمتكم.

مع خالص التحية،
شركة الاتحاد التجارية للاستيراد والتصدير`;

export const CONTACT_REPLY_EMAIL_SUBJECT = 'رد على رسالتكم | شركة الاتحاد التجارية';

/** Normalize local phone (e.g. 0111…) to international digits for wa.me */
export function toWhatsAppPhone(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `20${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppReplyUrl(phone: string): string {
  const normalized = toWhatsAppPhone(phone);
  if (!normalized) return '';
  return `https://wa.me/${normalized}?text=${encodeURIComponent(CONTACT_REPLY_MESSAGE)}`;
}

/** Gmail compose URL — opens in the browser (mailto often fails without a desktop mail app) */
export function buildEmailReplyUrl(email: string): string {
  const address = (email || '').trim();
  if (!address) return '';
  const url = new URL('https://mail.google.com/mail/');
  url.searchParams.set('view', 'cm');
  url.searchParams.set('fs', '1');
  url.searchParams.set('to', address);
  url.searchParams.set('su', CONTACT_REPLY_EMAIL_SUBJECT);
  url.searchParams.set('body', CONTACT_REPLY_MESSAGE);
  return url.toString();
}

export function openEmailReply(email: string, event?: Event): void {
  event?.preventDefault();
  event?.stopPropagation();
  const url = buildEmailReplyUrl(email);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
