import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService, Settings } from '../services/settings.service';
import { Observable, of, concat, pipe } from 'rxjs';
import { tap, take, switchMap, map, distinctUntilChanged, delay, startWith, skip } from 'rxjs/operators';

const propertyUpdated = (property: string) =>
  pipe(
    map(form => form[property]),
    distinctUntilChanged(),
    skip(1),
    switchMap(_ => {
      return concat(of(true), of(false).pipe(delay(1000)));
    }),
  );

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  form: FormGroup;
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

    this.form.valueChanges.subscribe((form: Settings) => this.settingsService.updateSettings(form));

    const formChanged$ = this.form.valueChanges.pipe(startWith(this.form.value));
    this.intervalUpdated$ = formChanged$.pipe(propertyUpdated('interval'));
    this.showNotificationsUpdated$ = formChanged$.pipe(propertyUpdated('showNotifications'));
    this.pollingEnabledUpdated$ = formChanged$.pipe(propertyUpdated('pollingEnabled'));
  }
}
