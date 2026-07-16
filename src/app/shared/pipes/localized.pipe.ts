import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'localized',
  pure: false,
})
export class LocalizedPipe implements PipeTransform {
  constructor(private lang: LanguageService) {}

  transform(ar?: string | null, en?: string | null): string {
    void this.lang.current;
    return this.lang.localized(ar, en);
  }
}
