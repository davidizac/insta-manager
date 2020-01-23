import { Input } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

export abstract class AbstractInsta {
    @Input() username: string;
    nextCursor = localStorage.getItem('cursor');
    userId: string;
    profilPic: string;
    isPostInitialized = false;
    first = 50;
    query_hash = 'e769aa130647d2354c40ea6a439bfc08';
    userDoesNotExist = false;
    isPrivateAccount = false;

    resetField() {
        // tslint:disable-next-line:max-line-length
        this.nextCursor = localStorage.getItem('cursor');
        if (this.nextCursor === 'null' || !this.nextCursor) {
            axios.get(`${environment.serverUrl}/api/cursor`).then(res => {
                this.nextCursor = res.data;
                localStorage.setItem('cursor', this.nextCursor);
            });
        }
        this.userId = null;
        this.profilPic = null;
        this.isPostInitialized = false;
        this.isPrivateAccount = false;
    }

    get apiUrl(): string {
        if (this.userId && this.nextCursor) {
            // tslint:disable-next-line:max-line-length
            return `https://www.instagram.com/graphql/query/?query_hash=${this.query_hash}&variables={"id":"${this.userId}","first":${this.first},"after":"${this.nextCursor}"}`;
        }
        return '';
    }

    public getUserData(): Promise<void> {
        return axios.get(`https://instagram.com/${this.username}`).then(res => {
            const parser = new DOMParser();
            const html = parser.parseFromString(res.data, 'text/html');
            const scripts = html.querySelectorAll('script');
            scripts.forEach(script => {
                try {
                    this.userId = script.innerText.toString().split(`"id":`)[1].split(`"`)[1];
                    this.profilPic = script.innerText.toString().split(`"profile_pic_url":`)[1].split(`"`)[1].replace(/\\u0026/g, '&');
                } catch (e) { }
            });
        }).catch(() => {
            this.userDoesNotExist = true;
        });
    }

}
