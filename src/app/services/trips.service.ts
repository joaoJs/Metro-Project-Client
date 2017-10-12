import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TripsService {

  private tripSubject = new Subject();

  tripSubject$ = this.tripSubject.asObservable();

  constructor() { }

  updateTrips(trip) {
    this.tripSubject.next(trip);
  }

}
