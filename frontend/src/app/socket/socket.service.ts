import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class SocketService {
    socket: any;
    newCursor: Subject<any> = new Subject<any>();

    constructor() {
        this.socket = io(`${environment.serverUrl}`);
        this.socketListener(this.socket);
    }

    get getSocket() {
        return this.socket;
    }

    socketListener(socket) {
        socket.on('cursor', (data) => {
            this.newCursor.next(data);
        });
    }

    getCursorAsObservable() {
        return this.newCursor.asObservable();
    }

}
