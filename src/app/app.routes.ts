import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { JokeListComponent } from './joke-list/joke-list.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'jokes',
    component: JokeListComponent
  }
];
