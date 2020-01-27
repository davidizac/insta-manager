import { Component, ViewChild, OnInit } from '@angular/core';
import { PopularPostComponent } from './popular-post/popular-post.component';
import { LikesViewerComponent } from './likes-viewer/likes-viewer.component';
import { SocketService } from './socket/socket.service';
import { FormControl } from '@angular/forms';
import { switchMap, debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import axios from 'axios';
import { User } from './models/user.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  username = new FormControl();
  filterSelected = 'Popular Post';
  filters: string[] = ['Popular Post', 'All Posts'];
  users: Array<User> = [];

  constructor(private socketService: SocketService) { }

  @ViewChild(PopularPostComponent, { static: true }) popularPostComponent: PopularPostComponent;
  @ViewChild(LikesViewerComponent, { static: true }) likesViewerComponent: LikesViewerComponent;

  get apiQueryUrl(): string {
    if (this.username.value) {
      return `https://www.instagram.com/web/search/topsearch/?query=${this.username.value}`;
    }
    return '';
  }

  ngOnInit() {

    this.username.valueChanges
      .pipe(
        tap(() => this.users = []),
        filter(() => !!this.username.value),
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

  startComponent(component) {
    component.isLoading = true;
    component.resetField();
    return component.getUserData()
      .catch(() => {
        this.username.setErrors({
          isUserDoesNotExist: true
        });
        component.isLoading = false;
      });
  }

  getPopularPic() {
    this.startComponent(this.popularPostComponent)
      .then(() => {
        this.popularPostComponent.getPopularPic()
          .catch(() => {
            if (!this.username.hasError('isUserDoesNotExist')) {
              this.username.setErrors({
                isPrivateAccount: true
              });
              this.popularPostComponent.isLoading = false;
            }
          });
      });
  }

  getAllPics() {
    this.startComponent(this.likesViewerComponent)
      .then(() => {
        this.likesViewerComponent.getAllPics()
          .catch(() => {
            if (!this.username.hasError('isUserDoesNotExist')) {
              this.username.setErrors({
                isPrivateAccount: true
              });
              this.likesViewerComponent.isLoading = false;
            }
          });
      });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }



}
