import { ApiService } from './../api.service';
import { RelayService } from '../relay.service';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css'],
})
export class UiComponent implements OnInit {
  data: any;
  ipInput: string = '192.212.174.101'; //initial value/placeholder
  ipRegEx = /(\d{1,8}\.){3}\d{1,8}/gm;

  constructor(private api: ApiService, private relay: RelayService) {}

  onSubmit(ip: string): void {
    if (!this.ipRegEx.test(ip)) {
      return alert('Invalid IP Address');
    }

    this.ipInput = ip;
    this.api.updateApiUrl(this.ipInput);
    this.api.getData().subscribe((res) => {
      this.processData(res);
    });
  }

  processData(data: any) {
    this.data = data;

    this.relay.setLatLong(this.getCoordinates());
    this.relay.sendClickEvent(this.getCoordinates());
  }

  getCoordinates() {
    let coords: L.LatLngExpression = [this.data.latitude, this.data.longitude];
    return coords;
  }

  get dataIp() {
    return this.data.ip ? this.data.ip : 'n/a - try another IP Address';
  }

  get dataLocation() {
    const region = this.data.region_code ? this.data.region_code : null;
    const city = this.data.city ? this.data.city : 'not available';
    const zip = this.data.postal ? this.data.postal : null;
    const location = zip ? `${city}, ${region} ${zip}` : `${city}`;
    return this.data ? location : 'not available';
  }

  get dataTimezone() {
    if (this.data) {
      const utcOffset = this.data.utc_offset;
      const hours = utcOffset.substring(0, utcOffset.length - 2);
      const mins = utcOffset.substring(utcOffset.length - 2, utcOffset.length);
      const union = `${hours}:${mins}`;

      return this.data.utc_offset ? `UTC ${union}` : 'not available';
    }
    return;
  }

  get dataISP() {
    return this.data && this.data.org ? this.data.org : 'not available';
  }

  ngOnInit(): void {
    this.onSubmit(this.ipInput);
  }
}
