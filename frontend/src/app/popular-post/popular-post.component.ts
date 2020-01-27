import { Component, OnChanges } from '@angular/core';
import axios from 'axios';
import { AbstractInsta } from '../abstract-insta.class';
import { Post } from '../models/post.model';
import { getPostUrl } from '../instagram-api.constant';

@Component({
  selector: 'app-popular-post',
  templateUrl: './popular-post.component.html',
  styleUrls: ['./popular-post.component.scss']
})
export class PopularPostComponent extends AbstractInsta implements OnChanges {

  iterationNumber = -1;
  post: Post;
  totalPics = 0;

  ngOnChanges() {
    super.ngOnChanges();
    this.post = new Post();
    this.iterationNumber = -1;
    this.getPopularPost();
  }

  get progressBarValue(): number {
    if (this.iterationNumber > 0) {
      return (this.iterationNumber * 50 * 100) / this.totalPics;
    }
    return 0;
  }

  getPopularPost() {
    return axios.get(getPostUrl(this.user.pk, this.nextCursor)).then((response) => {
      this.iterationNumber++;
      const data = response.data.data.user.edge_owner_to_timeline_media;
      this.totalPics = data.count;
      this.getPopularPostForCurrentLoad(data.edges);
      this.isLoading = false;
      if (data.page_info.has_next_page && this.iterationNumber < 100 && data.edges[0].node.owner.id === this.user.pk) {
        this.nextCursor = data.page_info.end_cursor;
        this.getPopularPost();
      }
    });
  }

  getPopularPostForCurrentLoad(nodes) {
    nodes.forEach(({ node }) => {
      if (this.post.numberOfLikes < node.edge_media_preview_like.count) {
        this.post.numberOfLikes = node.edge_media_preview_like.count;
        this.post.imageUrl = node.display_url;
        this.post.comment = node.edge_media_to_caption.edges[0] ? node.edge_media_to_caption.edges[0].node.text : null;
      }
    });
  }
}

