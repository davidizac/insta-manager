import { Component, ViewChild } from '@angular/core';
import { PopularPostComponent } from './popular-post/popular-post.component';
import { LikesViewerComponent } from './likes-viewer/likes-viewer.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  username: string;
  filterSelected = 'Most popular post';
  filters: string[] = ['Most popular post', 'See all likes'];

  @ViewChild(PopularPostComponent, { static: true }) popularPostComponent: PopularPostComponent;
  @ViewChild(LikesViewerComponent, { static: true }) likesViewerComponent: LikesViewerComponent;


  onChangeFilter(event) {
    this.filterSelected = event.value;
  }

  onSubmit() {
    if (this.filterSelected === 'Most popular post') {
      this.startComponent(this.popularPostComponent)
        .then(() => {
          this.popularPostComponent.getPopularPic()
            .catch(() => {
              this.popularPostComponent.isPrivateAccount = true;
            });
        });
    } else {
      this.startComponent(this.likesViewerComponent)
        .then(() => {
          this.likesViewerComponent.getAllPostsByUser()
            .catch(() => {
              this.likesViewerComponent.isPrivateAccount = true;
            });
        });
    }
  }

  startComponent(component) {
    component.resetField();
    return component.getUserData();
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }
}
