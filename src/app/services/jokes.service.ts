import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  map,
  shareReplay,
  switchMap,
  catchError,
  distinctUntilChanged
} from "rxjs/operators";
import { Observable, timer, NEVER, of } from "rxjs";
import { SettingsService, select } from "./settings.service";

export interface JokesResponse {
  type: "sucess";
  value: Array<Joke>;
}

export interface Joke {
  id: number;
  joke: string;
  categories: Array<string>;
}

@Injectable({
  providedIn: "root"
})
export class JokesService {
  API_ENDPOINT = "https://api.icndb.com/jokes/random/5?limitTo=[nerdy]";
  jokes$: Observable<Array<Joke>>;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient
  ) {}

  getJokes() {
    if (this.jokes$) {
      return this.jokes$;
    }

    this.jokes$ = this.settingsService.settings$.pipe(
      map(({ interval, pollingEnabled }) => ({ interval, pollingEnabled })),
      distinctUntilChanged(
        (x, y) =>
          x.interval === y.interval && y.pollingEnabled === x.pollingEnabled
      ),
      switchMap(({ pollingEnabled, interval }) => {
        if (pollingEnabled) {
          return timer(0, interval).pipe(
            switchMap(_ =>
              this.http.get<JokesResponse>(this.API_ENDPOINT).pipe(
                map(res => res.value),
                catchError(_ => of([]))
              )
            )
          );
        }
        return NEVER;
      }),
      shareReplay(1)
    );

    return this.jokes$;
  }

  stopPolling() {}
}
