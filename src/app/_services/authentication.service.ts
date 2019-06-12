import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {RequestOptions } from './_models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<string>;
    private currentTokenSubject: BehaviorSubject<string>;
    public currentUser: Observable<string>;
    public token: Observable<string>;
    private authUrl = environment.AUTH_API;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentTokenSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('token')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.token = this.currentTokenSubject.asObservable();
    }

    public get currentUserValue(): string {
        return this.currentUserSubject.value;
    }

    public get currentTokenValue(): string {
        return this.currentTokenSubject.value;
    }

    login(username: string, password: string) {
        let params = new HttpParams()
        .set('username', username)
        .set('password', password)
        .set('grant_type', 'password')
        .set('client_id', 'clientId');
        let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8','Authorization': 'Basic ' + btoa("clientId:secret")});

        const options: RequestOptions = {
            headers:headers,
            params:params,
        };
        return this.http.post<any>(this.authUrl, null, options)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(username));
                    localStorage.setItem('token', JSON.stringify(user.access_token));
                    this.currentUserSubject.next(username);
                    this.currentTokenSubject.next(user.access_token);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.currentTokenSubject.next(null);
    }
}