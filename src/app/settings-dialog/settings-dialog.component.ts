import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService, Settings } from '../services/settings.service';
import { Observable, of, concat, pipe } from 'rxjs';
import { tap, take, switchMap, map, distinctUntilChanged, delay, startWith } from 'rxjs/operators';

const propertyUpdated = (property: string) =>
  pipe(
    map(form => form[property]),
    distinctUntilChanged(),
    switchMap(_ => {
      return concat(of(true), of(false).pipe(delay(1000)));
    }),
    startWith(false),
  );

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  form: FormGroup;
  showSettingsUpdated$: Observable<boolean>;
  intervalUpdated$: Observable<boolean>;
  pollingEnabledUpdated$: Observable<boolean>;
  showNotificationsUpdated$: Observable<boolean>;

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {}

  ngOnInit() {
    this.form = this.fb.group({
      pollingEnabled: true,
      interval: [5000, Validators.pattern(/^\d+$/)],
      showNotifications: true,
    });

    this.settingsService.settings$.pipe(take(1)).subscribe(settings => this.form.patchValue(settings));

    this.showSettingsUpdated$ = this.form.valueChanges.pipe();

    this.form.valueChanges.subscribe((form: Settings) => this.settingsService.updateSettings(form));

    this.intervalUpdated$ = this.form.valueChanges.pipe(propertyUpdated('interval'));
    this.showNotificationsUpdated$ = this.form.valueChanges.pipe(propertyUpdated('showNotifications'));
    this.pollingEnabledUpdated$ = this.form.valueChanges.pipe(propertyUpdated('pollingEnabled'));
  }
}
