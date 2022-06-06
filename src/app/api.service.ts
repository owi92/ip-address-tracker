import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  ip: string = '192.212.174.101'; //placeholder
  url = `https://ipapi.co/`;
  apiUrl = `${this.url}${this.ip}/json`;

  constructor(private http: HttpClient) {}

  getIP(domain: any) {
    const address = `http://ip-api.com/json/${domain}?fields=query`;
    return this.http.get(address);
  }

  getData() {
    return this.http.get(this.apiUrl);
  }

  updateApiUrl(ip: string) {
    console.log('update ip: ' + ip);

    this.apiUrl = `${this.url}${ip}/json`;
  }
}
