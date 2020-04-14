import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { timeout } from 'rxjs/operators';

@Injectable()

export class ApiService {

  constructor(private http: HttpClient) { }
  
 
  post(url, data) {
    return this.http.post(url, data).pipe(timeout(14400000));
  }

  get(url) {
    return this.http.get(url);
  }

  // corsGet(url) {
  //   fetch(url, {
  //     headers: {
  //       'Content-Type': 'application/json;charset=UTF-8',
  //       'Access-Control-Allow-Origin': '*',
  //       'Accept': '*',
  //       'Cache-Control': 'no-cahce'
  //     },
  //     method: 'GET',
  //     mode: 'no-cors',
  //     cache: 'no-cache'
  //   });
  // }
  
  
}