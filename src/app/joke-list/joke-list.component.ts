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

    const initialJokes$ = this.sourceJokes$.pipe(first());

    const mostRecentJokes$ = this.update$.pipe(
      withLatestFrom(this.sourceJokes$),
      map(([, jokes]) => jokes),
    );

    this.jokes$ = merge(initialJokes$, mostRecentJokes$);
  }
}
