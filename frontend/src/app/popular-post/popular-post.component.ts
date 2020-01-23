import { Component } from '@angular/core';
import axios from 'axios';
import { AbstractInsta } from '../abstract-insta.class';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-popular-post',
  templateUrl: './popular-post.component.html',
  styleUrls: ['./popular-post.component.scss']
})
export class PopularPostComponent extends AbstractInsta {

  cursors = [this.nextCursor];
  iterationNumber = 0;
  post: Post;
  totalPics = 0;
  isLoading = false;

  get progressBarValue(): number {
    if (this.iterationNumber > 0) {
      return (this.iterationNumber * this.first * 100) / this.totalPics;
    }
    return 0;
  }

  getPopularPic() {
    this.isLoading = true;
    return axios.get(this.apiUrl).then((response) => {
      this.iterationNumber++;
      const data = response.data.data.user.edge_owner_to_timeline_media;
      this.totalPics = data.count;
      this.getPopularPicForCurrentLoad(data.edges);
      this.isLoading = false;
      if (data.page_info.has_next_page && this.iterationNumber < 100 && data.edges[0].node.owner.id === this.userId) {
        this.nextCursor = data.page_info.end_cursor;
        this.cursors.push(this.nextCursor);
        setTimeout(() => {
          this.getPopularPic();
        }, 10);
      }
    }).catch(e => {
      console.error(e);
    });
  }

  getPopularPicForCurrentLoad(nodes) {
    nodes.forEach(({ node }) => {
      if (this.post.numberOfLikes < node.edge_media_preview_like.count) {
        this.post.numberOfLikes = node.edge_media_preview_like.count;
        this.post.imageUrl = node.display_url;
        this.post.comment = node.edge_media_to_caption.edges[0] ? node.edge_media_to_caption.edges[0].node.text : null;
        this.isPostInitialized = true;
      }
    });
  }

  resetField() {
    super.resetField();
    this.post = new Post();
    this.iterationNumber = 0;
    this.cursors = [];
  }

}

