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

  constructor(private socketService: SocketService) { }

  @ViewChild(PopularPostComponent, { static: true }) popularPostComponent: PopularPostComponent;
  @ViewChild(LikesViewerComponent, { static: true }) likesViewerComponent: LikesViewerComponent;

  ngOnInit() {
    this.socketService.getCursorAsObservable()
      .subscribe(newCursor => {
        localStorage.setItem('cursor', newCursor);
      })
  }


  onChangeFilter(event) {
    this.filterSelected = event.value;
  }

  onSubmit() {
    if (this.filterSelected === 'Popular Pic') {
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
