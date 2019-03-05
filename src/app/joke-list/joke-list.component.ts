import { Component, OnInit } from '@angular/core';
import { JokesService, Joke } from '../services/jokes.service';
import { Observable, Subject, merge } from 'rxjs';
import { skip, mapTo, distinctUntilChanged, startWith, withLatestFrom, map, first, switchMap } from 'rxjs/operators';

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
  reload$ = new Subject<void>();

  constructor(private jokesService: JokesService) { }

  ngOnInit() {
    this.sourceJokes$ = this.jokesService.getJokes();


    const initialNotification$ = this.getNotifications();

    const forceReload$ = this.reload$.pipe(
      switchMap(() => this.getNotifications())
    );

    // reload$               -------------------x----
    // getNotifcations       -a-----b------c---------
    // initialNotifications$ -------x-----------|----
    // forceReload$          -------------------------b-----------------
    //                                          --a---b----c------------
    // show$                 -------t-----------------t-----------------

    const show$ = merge(initialNotification$, forceReload$).pipe(
      mapTo(true)
    );

    const hide$ = this.update$.pipe(mapTo(false));

    this.showNotification$ = merge(show$, hide$).pipe(
      startWith(false),
      distinctUntilChanged()
    );

    // ----f----------t-------f------t

    const initialJokes$ = this.sourceJokes$.pipe(
      first(),
    );

    const mostRecentJokes$ = this.update$.pipe(
      withLatestFrom(this.sourceJokes$),
      map(([, jokes]) => jokes)
    );

    this.jokes$ = merge(initialJokes$, mostRecentJokes$);
  }

  getNotifications() {
    return this.jokesService.getJokes().pipe(skip(1));
  }

  forceReload() {
    console.log('force reloading');
    this.reload$.next();
  }
}
