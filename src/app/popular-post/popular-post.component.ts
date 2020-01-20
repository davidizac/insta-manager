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

  get progressBarValue(): number {
    if (this.iterationNumber > 0) {
      return (this.iterationNumber * this.first * 100) / this.totalPics;
    }
    return 0;
  }

  getMostLikedPic() {
    return super.getUserData()
      .then(() => {
        this.fetchImageFromInsta();
      });
  }

  fetchImageFromInsta() {
    return axios.get(this.apiUrl).then((response) => {
      this.iterationNumber++;
      const data = response.data.data.user.edge_owner_to_timeline_media;
      this.totalPics = data.count;
      this.getMostPopularImageForCurrentLoad(data.edges);
      if (data.page_info.has_next_page && this.iterationNumber < 20 && data.edges[0].node.owner.id === this.userId) {
        this.nextCursor = data.page_info.end_cursor;
        this.cursors.push(this.nextCursor);
        console.log(this.cursors)
        setTimeout(() => {
          this.fetchImageFromInsta();
        }, 10);
      }
    });
  }

  getMostPopularImageForCurrentLoad(nodes) {
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
  }

}

