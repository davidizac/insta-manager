import { Input, OnChanges } from '@angular/core';
import { User } from './models/user.model';

export abstract class AbstractInsta implements OnChanges {
    @Input() user: User;
    nextCursor: string;
    isLoading: boolean;

    ngOnChanges() {
        this.isLoading = true;
        this.nextCursor = localStorage.getItem('cursor');
    }

}
