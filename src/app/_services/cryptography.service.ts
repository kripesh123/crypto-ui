import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cryptography } from '../_models';

@Injectable({ providedIn: 'root' })
export class CryptographyService {
    
    private apiUrl = environment.CRYPTO_API;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(this.apiUrl + `/cryptography`);
    }

    encryptInput(input: string) {
        return this.http.post<Cryptography>(this.apiUrl + `/cryptography`, {input});
    }

    getById(id: number) {
        return this.http.get<Cryptography>(this.apiUrl + '/cryptography/' + id);
    }

    update(id: number, input: string) {
        return this.http.put<Cryptography>(this.apiUrl + '/cryptography/' + id, {input});
    }

}