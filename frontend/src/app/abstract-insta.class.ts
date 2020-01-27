import { Input, OnInit, OnChanges } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';

export abstract class AbstractInsta implements OnInit {
    @Input() user: User;
    nextCursor = localStorage.getItem('cursor');
    isPostInitialized = false;
    first = 50;
    query_hash = 'e769aa130647d2354c40ea6a439bfc08';
    isLoading = false;

    ngOnInit() {
        this.resetField();
    }

    resetField() {
        // tslint:disable-next-line:max-line-length
        this.nextCursor = localStorage.getItem('cursor');
        if (this.nextCursor === 'null' || !this.nextCursor) {
            axios.get(`${environment.serverUrl}/api/cursor`).then(res => {
                this.nextCursor = res.data;
                localStorage.setItem('cursor', this.nextCursor);
            });
        }
        this.user = new User();
        this.isPostInitialized = false;
    }

    get apiUrl(): string {
        if (this.user.pk && this.nextCursor) {
            // tslint:disable-next-line:max-line-length
            return `https://www.instagram.com/graphql/query/?query_hash=${this.query_hash}&variables={"id":"${this.user.pk}","first":${this.first},"after":"${this.nextCursor}"}`;
        }
        return '';
    }
}
