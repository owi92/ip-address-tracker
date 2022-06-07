import { ApiService } from './../api.service';
import { RelayService } from '../relay.service';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { IpObj } from '../ip-obj';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css'],
})
export class UiComponent implements OnInit {
  data$: IpObj = {
    ip: '192.212.174.101', //initial value/placeholder
    city: '',
    region_code: '',
    postal: '',
    latitude: 0,
    longitude: 0,
    utc_offset: '',
    org: '',
    error: false,
    reserved: false,
  };
  ipRegEx = /(\d{1,8}\.){3}\d{1,8}/;
  domainRegEx =
    /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

  constructor(private api: ApiService, private relay: RelayService) {}

  //todo: this needs serious refactoring
  async onSubmit(ip: string): Promise<void> {
    let internalIp: any = ip;

    if (!this.ipRegEx.test(internalIp)) {
      if (!this.domainRegEx.test(internalIp)) {
        console.log('error: ' + internalIp);

        return alert('Please enter another IP Address.');
      } else if (this.domainRegEx.test(internalIp)) {
        console.log('domain:' + internalIp);

        const trunc = internalIp.match(this.domainRegEx);

        var response = await fetch(`https://dns.google/resolve?name=${trunc}`);
        var json = await response.json();
        console.log(trunc + ': ' + json.Answer[0].data);
        internalIp = json.Answer[0].data;
      }
    }

    console.log('internal IP: ' + internalIp);

    this.api.updateApiUrl(internalIp);
    this.api.getData().subscribe((result) => {
      this.processData(result);
    });
  }

  processData(data: any) {
    this.data$ = data;
    if (data.reserved) {
      return alert('IP is reserved. Please try another Address.');
    }

    this.relay.setLatLong(this.getCoordinates());
    this.relay.sendClickEvent(this.getCoordinates());
  }

  getCoordinates() {
    let coords: L.LatLngExpression = [
      this.data$.latitude,
      this.data$.longitude,
    ];
    return coords;
  }

  get dataIp() {
    return this.data$.ip;
  }

  get dataLocation() {
    const region = this.data$.region_code ? this.data$.region_code : null;
    const city = this.data$.city ? this.data$.city : 'not available';
    const zip = this.data$.postal ? this.data$.postal : null;
    const location = zip ? `${city}, ${region} ${zip}` : `${city}`;
    return this.data$ ? location : 'not available';
  }

  get dataTimezone() {
    if (this.data$.utc_offset) {
      const utcOffset = this.data$.utc_offset;
      const hours = utcOffset.substring(0, utcOffset.length - 2);
      const mins = utcOffset.substring(utcOffset.length - 2, utcOffset.length);
      const union = `${hours}:${mins}`;

      return this.data$.utc_offset ? `UTC ${union}` : 'not available';
    }
    return 'not available';
  }

  get dataISP() {
    return this.data$ && this.data$.org ? this.data$.org : 'not available';
  }

  ngOnInit(): void {
    this.onSubmit(this.data$.ip);
  }
}
