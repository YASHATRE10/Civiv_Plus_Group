import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppTranslateLoader implements TranslateLoader {
  constructor(private readonly http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`/i18n/${lang}.json`);
  }
}
