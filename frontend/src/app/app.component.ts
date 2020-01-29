import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap, debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import axios from 'axios';
import { User } from './models/user.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { searchUrl } from './instagram-api.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  formControl = new FormControl();
  filterSelected = 'Popular Post';
  filters: string[] = ['Popular Post', 'All Posts'];
  users: Array<User> = [];
  userSelected: User;
  mainSubscription: Subscription = new Subscription();
  cursor: string;

  constructor() { }

  ngOnInit() {
    const formControlSubscription = this.formControl.valueChanges
      .pipe(
        tap(() => this.users = []),
        tap(() => this.userSelected = null),
        filter(() => !!this.formControl.value),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(() => {
          return axios.get(searchUrl(this.formControl.value))
            .then(res => {
              if (res.data.users) {
                this.users = res.data.users
                  .map(user => new User(user.user));
              }
            });
        })
      )
      .subscribe();

    axios.get(`${environment.serverUrl}/api/cursor`)
      .then(res => {
        this.cursor = res.data;
      });


    this.mainSubscription.add(formControlSubscription);
  }

  onChangeFilter(event) {
    this.filterSelected = event.value;
  }

  getUserSelected(event: MatAutocompleteSelectedEvent) {
    const user = new User(event.option.value);
    if (user.is_private) {
      this.formControl.setErrors({
        isPrivateAccount: true
      });
    } else {
      this.userSelected = user;
    }
  }

  displayFn(user?: User): string | undefined {
    return user ? user.username : undefined;
  }

  ngOnDestroy() {
    this.mainSubscription.unsubscribe();
  }

}
