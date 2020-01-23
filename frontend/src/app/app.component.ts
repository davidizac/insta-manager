import { Component, ViewChild, OnInit } from '@angular/core';
import { PopularPostComponent } from './popular-post/popular-post.component';
import { LikesViewerComponent } from './likes-viewer/likes-viewer.component';
import { SocketService } from './socket/socket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  username: string;
  filterSelected = 'Popular Pic';
  filters: string[] = ['Popular Pic', 'All Pics'];
  errorMessage = '';

  constructor(private socketService: SocketService) { }

  @ViewChild(PopularPostComponent, { static: true }) popularPostComponent: PopularPostComponent;
  @ViewChild(LikesViewerComponent, { static: true }) likesViewerComponent: LikesViewerComponent;

  ngOnInit() {
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
      case 'Popular Pic':
        this.startComponent(this.popularPostComponent)
          .then(() => {
            this.popularPostComponent.getPopularPic()
              .catch(() => {
                this.popularPostComponent.isPrivateAccount = true;
              });
          });
        break;
      case 'All Pics':
        this.startComponent(this.likesViewerComponent)
          .then(() => {
            this.likesViewerComponent.getAllPics()
              .catch(() => {
                this.errorMessage = 'This account is private.';
              });
          });
        break;
      default:
        break;
    }
  }

  startComponent(component) {
    component.resetField();
    return component.getUserData()
      .catch(() => {
        this.errorMessage = 'User does not exist';
      });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }
}
