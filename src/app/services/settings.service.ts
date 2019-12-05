import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, pipe } from 'rxjs';
import { scan, map, distinctUntilChanged } from 'rxjs/operators';

export interface Settings {
  pollingEnabled: boolean;
  interval: number;
  showNotifications: boolean;
}

export function select<T extends Settings>(mapFn: (settings: T) => T[keyof T]) {
  return pipe(
    map(mapFn),
    distinctUntilChanged(),
  );
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  initialState: Settings = {
    pollingEnabled: true,
    interval: 5000,
    showNotifications: true,
  };

  private _settings$ = new BehaviorSubject<Partial<Settings>>(this.initialState);

  settings$: Observable<Partial<Settings>>;

  constructor() {
    this.settings$ = this._settings$.pipe(scan((state, updates) => ({ ...state, updates })));
  }

  updateSettings(update: Partial<Settings>) {
    this._settings$.next(update);
  }
}
