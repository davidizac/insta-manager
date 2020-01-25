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
  isPublicAccount = true;
  isUserExist = true;

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
        this.getPopularPic();
        break;
      case 'All Pics':
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
        this.isUserExist = false;
        component.isLoading = false;
        setTimeout(() => {
          this.isUserExist = true;
        }, 3000);
      });
  }

  getPopularPic() {
    this.startComponent(this.popularPostComponent)
      .then(() => {
        this.popularPostComponent.getPopularPic()
          .catch(() => {
            if (this.isUserExist) {
              this.isPublicAccount = false;
              this.popularPostComponent.isLoading = false;
              setTimeout(() => {
                this.isPublicAccount = true;
              }, 3000);
            }
          });
      });
  }

  getAllPics() {
    this.startComponent(this.likesViewerComponent)
      .then(() => {
        this.likesViewerComponent.getAllPics()
          .catch(() => {
            if (this.isUserExist) {
              this.isPublicAccount = false;
              this.likesViewerComponent.isLoading = false;
              setTimeout(() => {
                this.isPublicAccount = true;
              }, 3000);
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
