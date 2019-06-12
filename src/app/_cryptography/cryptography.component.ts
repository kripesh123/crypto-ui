import { Component, OnInit} from '@angular/core';
import { first } from 'rxjs/operators';

import { Cryptography } from '../_models';
import { CryptographyService, AlertService } from '../_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({ selector: 'app-cryptography', templateUrl: 'cryptography.component.html' })
export class CryptographyComponent implements OnInit {
    cryptographyList: Cryptography[] = [];

    cryptographyForm: FormGroup;
    loading = false;
    submitted = false;
    decryptValue = false;

    constructor(
        private cryptographyService: CryptographyService,
        private formBuilder: FormBuilder,
        private alertService: AlertService
        ) {}

    ngOnInit() {
        this.getCryptographyList();
        this.cryptographyForm = this.formBuilder.group({
            id: ['', ],
            encryption: ['', Validators.required],
            decryption: ['', ]
        });
    }

    get f() { return this.cryptographyForm.controls; }

    getCryptographyList() {
        this.cryptographyService.getAll().subscribe(map => {
            this.cryptographyList = map;
        });
    }

    encrypt() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.cryptographyForm.invalid) {
            return;
        }
        this.loading = true;
        this.saveOrUpdate(this.f.id.value, this.f.encryption.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.getCryptographyList();
                    this.loading = false;
                    this.resetForm();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

    }

    saveOrUpdate(id: number, input: string) {
        return id ? this.cryptographyService.update(id, input) : this.cryptographyService.encryptInput(input);
    }

    getById(id: number) {
        this.cryptographyService.getById(id)
            .pipe(first())
            .subscribe(
                data => {
                    this.cryptographyForm.setValue({
                        id: data.id,
                        encryption: data.encodedValue,
                        decryption: data.inputText
                    });
                },
                error => {
                    this.alertService.error(error);
                });
    }

    decrypt() {
        return this.decryptValue = !this.decryptValue;
    }

    resetForm() {
        this.decryptValue = false;
        this.cryptographyForm.reset();
        this.submitted = false;
    }
}