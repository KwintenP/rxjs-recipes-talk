import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay, switchMap, mapTo, takeUntil, tap, publishReplay, refCount } from 'rxjs/operators';
import { Observable, timer, Subject, merge, BehaviorSubject } from 'rxjs';

export interface JokesResponse {
  type: 'sucess',
  value: Array<Joke>
}

export interface Joke {
  id: number;
  joke: string;
  categories: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class JokesService {
  API_ENDPOINT = 'https://api.icndb.com/jokes/random/5?limitTo=[nerdy]';
  jokes$: Observable<Array<Joke>>;


  constructor(private http: HttpClient) { }

  getJokes() {
    if (this.jokes$) {
      return this.jokes$;
    }

    this.jokes$ = timer(0, 10000).pipe(
      tap(console.log),
      switchMap(() => this.http.get<JokesResponse>(this.API_ENDPOINT)),
      map(data => data.value),
      shareReplay(1)
    );

    // this.jokes$ = this.reload$.pipe(
    //   tap(_ => console.log('nexting it here')),
    //   switchMap(_ => {
    //     console.log('restarting poll jokes');
    //     return pollJokes$;
    //   }),
    //   shareReplay(1),
    // );

    return this.jokes$;
  }

  // forceReload() {
  //   console.log('reload called');
  //   this.reload$.next(null);
  // }
}
