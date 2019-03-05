import { TestBed } from '@angular/core/testing';

import { JokesService } from './jokes.service';

describe('JokesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JokesService = TestBed.get(JokesService);
    expect(service).toBeTruthy();
  });
});
