import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService, Settings } from '../services/settings.service';
import { Observable, of, concat, pipe } from 'rxjs';
import { tap, take, switchMap, map, distinctUntilChanged, delay, startWith, skip } from 'rxjs/operators';

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
  }
}
