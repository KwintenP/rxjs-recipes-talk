import { Component, OnInit } from '@angular/core';
import { JokesService, Joke } from '../services/jokes.service';
import { Observable, Subject, merge, NEVER, of } from 'rxjs';
import {
  skip,
  mapTo,
  distinctUntilChanged,
  startWith,
  withLatestFrom,
  map,
  first,
  switchMap,
  shareReplay,
  scan,
} from 'rxjs/operators';
import { SettingsService, select, Settings } from '../services/settings.service';

@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss'],
})
export class JokeListComponent implements OnInit {
  sourceJokes$: Observable<Array<Joke>>;
  jokes$: Observable<Array<Joke>>;
  update$ = new Subject();
  showNotification$: Observable<boolean>;

  constructor(private jokesService: JokesService, private settingsService: SettingsService) {}

  ngOnInit() {
    this.sourceJokes$ = this.jokesService.getJokes();

    const show$ = this.sourceJokes$.pipe(
      skip(1),
      mapTo(true),
    );

    const hide$ = this.update$.pipe(mapTo(false));

    const showNotificationSettings$ = this.settingsService.settings$.pipe(
      select(({ showNotifications }) => showNotifications),
    );

    this.showNotification$ = showNotificationSettings$.pipe(
      switchMap(showNotifications => {
        if (showNotifications) {
          return merge(show$, hide$).pipe(startWith(false));
        }

        return of(false);
      }),
    );

    const initialJokes$ = this.sourceJokes$.pipe(first());

    const mostRecentJokes$ = this.update$.pipe(
      withLatestFrom(this.sourceJokes$),
      map(([, jokes]) => jokes),
    );

    this.jokes$ = showNotificationSettings$.pipe(
      switchMap(showNotifications => {
        if (showNotifications) {
          return merge(initialJokes$, mostRecentJokes$);
        } else {
          return this.sourceJokes$;
        }
      }),
    );
  }
}
