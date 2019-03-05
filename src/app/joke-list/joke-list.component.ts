import { Component, OnInit } from '@angular/core';
import { JokesService, Joke } from '../services/jokes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.component.html',
  styleUrls: ['./joke-list.component.scss']
})
export class JokeListComponent implements OnInit {
  jokes$: Observable<Array<Joke>>;

  constructor(private jokesService: JokesService) { }

  ngOnInit() {
    this.jokes$ = this.jokesService.getJokes();
  }
}
