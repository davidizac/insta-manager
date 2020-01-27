import { Component, ViewChild, OnInit } from '@angular/core';
import { PopularPostComponent } from './popular-post/popular-post.component';
import { LikesViewerComponent } from './likes-viewer/likes-viewer.component';
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

  @ViewChild(PopularPostComponent, { static: true }) popularPostComponent: PopularPostComponent;
  @ViewChild(LikesViewerComponent, { static: true }) likesViewerComponent: LikesViewerComponent;

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
    this.userSelected = null;
    this.formControl = new FormControl();
    this.users = [];
  }

  onSubmit() {
    switch (this.filterSelected) {
      case 'Popular Post':
        this.getPopularPic();
        break;
      case 'All Posts':
        this.getAllPics();
        break;
      default:
        break;
    }
  }


  getPopularPic() {
    this.popularPostComponent.isLoading = true;
    this.popularPostComponent.resetField();
    this.popularPostComponent.user = this.userSelected;
    this.popularPostComponent.getPopularPic()
      .catch(() => {
        if (!this.formControl.hasError('isUserDoesNotExist')) {
          this.formControl.setErrors({
            isPrivateAccount: true
          });
          this.popularPostComponent.isLoading = false;
        }
      });
  }

  getAllPics() {
    this.likesViewerComponent.isLoading = true;
    this.likesViewerComponent.resetField();
    this.likesViewerComponent.user = this.userSelected;
    this.likesViewerComponent.getAllPics()
      .catch(() => {
        if (!this.formControl.hasError('isUserDoesNotExist')) {
          this.formControl.setErrors({
            isPrivateAccount: true
          });
          this.likesViewerComponent.isLoading = false;
        }
      });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }

  getUserSelected(event: MatAutocompleteSelectedEvent) {
    this.userSelected = new User(event.option.value);
    this.onSubmit();
  }

  displayFn(user?: User): string | undefined {
    return user ? user.username : undefined;
  }

}
