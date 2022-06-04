import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class RelayService {
  private subject = new Subject<any>();
  coordinates?: L.LatLngExpression = [0, 0];

  constructor() {}

  sendClickEvent(coords: L.LatLngExpression) {
    this.subject.next(coords);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  setLatLong(latLong: L.LatLngExpression) {
    this.coordinates = latLong;
  }

  getLatLong() {
    return this.coordinates;
  }
}
