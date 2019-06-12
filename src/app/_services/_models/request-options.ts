import {HttpHeaders, HttpParams} from '@angular/common/http';

export class RequestOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[]; };
  params?: HttpParams | { [param: string]: string | string[]; };
}
