import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isRoot: Observable<boolean>;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isRoot = this.router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map((x: RouterEvent) => x.url !== '/')
    );
  }
}
