import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private latLong: L.LatLngExpression = [43.733334, 7.416667];

  private initMap(): void {
    this.map = L.map('map', {
      center: this.latLong,
      zoom: 15,
    });

    const tiles = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '',
      }
    );
    tiles.addTo(this.map);

    const defaultMarker = L.icon({
      iconUrl: '../../assets/images/icon-location.svg',

      iconAnchor: [23, 0],
    });

    L.marker(this.latLong, { icon: defaultMarker }).addTo(this.map);
  }
  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
