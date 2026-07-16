import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private lang: LanguageService) {}

  transform(key: string): string {
    // Depend on current so impure pipe refreshes on language change
    void this.lang.current;
    return this.lang.t(key);
  }
}
