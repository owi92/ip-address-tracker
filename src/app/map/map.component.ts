import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { RelayService } from '../relay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  clickEventSubscription?: Subscription;
  private map: any;
  private latLong: any;

  private initMap(): void {
    this.latLong = this.relay.getLatLong();

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
      iconUrl: 'assets/images/icon-location.svg',

      iconSize: [46, 56],
      iconAnchor: [23, 56],
    });

    L.marker(this.latLong, { icon: defaultMarker }).addTo(this.map);
  }

  constructor(private relay: RelayService) {
    this.clickEventSubscription = this.relay.getClickEvent().subscribe(() => {
      this.map.remove();
      this.initMap();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
