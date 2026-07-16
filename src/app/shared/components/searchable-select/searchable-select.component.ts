import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SearchableOption {
  id: string;
  label: string;
  sublabel?: string;
}

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true,
    },
  ],
})
export class SearchableSelectComponent implements ControlValueAccessor {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  @Input() options: SearchableOption[] = [];
  @Input() placeholder = 'ابحث واختر...';
  @Input() emptyText = 'لا توجد نتائج مطابقة';
  @Input() clearable = false;
  @Input() set value(val: string | null) {
    this.innerValue = val || '';
  }

  @Output() valueChange = new EventEmitter<string | null>();

  open = false;
  query = '';
  disabled = false;
  private innerValue = '';

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private host: ElementRef<HTMLElement>) {}

  get selected(): SearchableOption | null {
    if (!this.innerValue) return null;
    return this.options.find((o) => o.id === this.innerValue) ?? null;
  }

  get displayLabel(): string {
    return this.selected?.label || '';
  }

  get filtered(): SearchableOption[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.options;
    return this.options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel || '').toLowerCase().includes(q)
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  writeValue(value: string | null): void {
    this.innerValue = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) {
      this.query = '';
      this.onTouched();
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }

  close(): void {
    this.open = false;
    this.query = '';
  }

  onQuery(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.open = true;
  }

  select(option: SearchableOption): void {
    this.innerValue = option.id;
    this.onChange(option.id);
    this.valueChange.emit(option.id);
    this.close();
  }

  clear(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.innerValue = '';
    this.onChange('');
    this.valueChange.emit(null);
    this.close();
  }
}
