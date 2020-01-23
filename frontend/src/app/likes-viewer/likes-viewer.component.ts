import { Component } from '@angular/core';
import { AbstractInsta } from '../abstract-insta.class';
import axios from 'axios';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-likes-viewer',
  templateUrl: './likes-viewer.component.html',
  styleUrls: ['./likes-viewer.component.scss']
})
export class LikesViewerComponent extends AbstractInsta {

  posts: Array<Post>;

  getAllPostsByUser() {
    return axios.get(this.apiUrl).then((response) => {
      if (response.data.data) {
        const data = response.data.data.user.edge_owner_to_timeline_media;
        this.nextCursor = data.page_info.end_cursor;
        this.getImagesForCurrentLoad(data.edges);
      }
    }).catch(e => {
      console.error(e);
    });
  }

  getImagesForCurrentLoad(nodes) {
    nodes.forEach(({ node }) => {
      const post = new Post(
        node.edge_media_preview_like.count,
        node.display_url,
        node.edge_media_to_caption.edges[0] ? node.edge_media_to_caption.edges[0].node.text : null);
      this.posts.push(post);
      this.isPostInitialized = true;
    });
  }

  onScroll() {
    this.getAllPostsByUser();
  }

  resetField() {
    super.resetField();
    this.posts = [];
  }

}
