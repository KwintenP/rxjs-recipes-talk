import { Component, OnInit } from '@angular/core';
import { JokesService, Joke } from '../services/jokes.service';
import { Observable, Subject, merge } from 'rxjs';
import { skip, mapTo, distinctUntilChanged, startWith, withLatestFrom, map, first } from 'rxjs/operators';

@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss']
})
export class JokeListComponent implements OnInit {
  sourceJokes$: Observable<Array<Joke>>;
  jokes$: Observable<Array<Joke>>;
  update$ = new Subject();
  showNotification$: Observable<boolean>;

  constructor(private jokesService: JokesService) { }

  ngOnInit() {
    this.sourceJokes$ = this.jokesService.getJokes();

    const show$ = this.sourceJokes$.pipe(
      skip(1),
      mapTo(true)
    );

    const hide$ = this.update$.pipe(mapTo(false));

    this.showNotification$ = merge(show$, hide$).pipe(
      startWith(false),
      distinctUntilChanged()
    );

    const initialJokes$ = this.sourceJokes$.pipe(
      first(),
    );

    const mostRecentJokes$ = this.update$.pipe(
      withLatestFrom(this.sourceJokes$),
      map(([, jokes]) => jokes)
    );

    this.jokes$ = merge(initialJokes$, mostRecentJokes$);
  }
}
