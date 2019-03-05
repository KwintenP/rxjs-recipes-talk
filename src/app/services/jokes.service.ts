import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    this.jokes$ = this.http.get<JokesResponse>(this.API_ENDPOINT).pipe(
      map(res => res.value),
    );
    
    return this.jokes$;
  }
}
