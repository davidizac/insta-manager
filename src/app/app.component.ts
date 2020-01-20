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
      this.popularPostComponent.resetField();
      this.popularPostComponent.getMostLikedPic();
    } else {
      this.likesViewerComponent.resetField();
      this.likesViewerComponent.getAllImages();
    }
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }
}
