import { Input, OnInit, OnChanges } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';
import { FormControl } from '@angular/forms';

export abstract class AbstractInsta implements OnInit {
    @Input() user: User;
    @Input() form: FormControl;
    nextCursor = localStorage.getItem('cursor');
    isPostInitialized = false;
    first = 50;
    // tslint:disable-next-line: variable-name
    query_hash = 'e769aa130647d2354c40ea6a439bfc08';
    isLoading = false;

    ngOnInit() {
        this.isLoading = true;
        this.nextCursor = localStorage.getItem('cursor');
        if (this.nextCursor === 'null' || !this.nextCursor) {
            this.fetchCursor();
        }
        this.isPostInitialized = false;
    }

    get apiUrl(): string {
        if (this.user.pk && this.nextCursor) {
            // tslint:disable-next-line:max-line-length
            return `https://www.instagram.com/graphql/query/?query_hash=${this.query_hash}&variables={"id":"${this.user.pk}","first":${this.first},"after":"${this.nextCursor}"}`;
        }
        return '';
    }

    private fetchCursor() {
        axios.get(`${environment.serverUrl}/api/cursor`).then(res => {
            this.nextCursor = res.data;
            localStorage.setItem('cursor', this.nextCursor);
        });
    }
}
