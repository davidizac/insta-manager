import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket/socket.service';
import { FormControl } from '@angular/forms';
import { switchMap, debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import axios from 'axios';
import { User } from './models/user.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  formControl = new FormControl();
  filterSelected = 'Popular Post';
  filters: string[] = ['Popular Post', 'All Posts'];
  users: Array<User> = [];
  userSelected: User;

  constructor(private socketService: SocketService) { }

  get apiQueryUrl(): string {
    if (this.formControl.value) {
      return `https://www.instagram.com/web/search/topsearch/?query=${this.formControl.value}`;
    }
    return '';
  }

  ngOnInit() {

    this.formControl.valueChanges
      .pipe(
        tap(() => this.users = []),
        tap(() => this.userSelected = null),
        filter(() => !!this.formControl.value),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(() => {
          return axios.get(this.apiQueryUrl)
            .then(res => {
              if (res.data.users) {
                this.users = res.data.users
                  .map(user => new User(user.user));
              }
            });
        })
      )
      .subscribe();

    this.socketService.getCursorAsObservable()
      .subscribe(newCursor => {
        localStorage.setItem('cursor', newCursor);
      });
  }

  onChangeFilter(event) {
    this.filterSelected = event.value;
    this.users = [];
  }

  getUserSelected(event: MatAutocompleteSelectedEvent) {
    this.userSelected = new User(event.option.value);
  }

  displayFn(user?: User): string | undefined {
    return user ? user.username : undefined;
  }

}
