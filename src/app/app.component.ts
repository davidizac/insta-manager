import { Component, ViewChild, ElementRef } from '@angular/core';
import axios from 'axios';
import { userInfo } from 'os';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  username: string;
  userId: string;
  nextCursor: string = 'QVFCQmkyNmsyOEFnYXA2alIzT216SEpacXFoWTQ4WnpEeXdSQ1dCSFlHc0twVjFOM3JXODZXemdoMkNwSG1WVWNrQ1RUR2RpX0ZEM0gtekJMWHBpX2JRSA==';
  cursors = [this.nextCursor];
  bestLikedPic = {
    numberOfLikes: 0,
    imageUrl: '',
    comment:''
  };
  iterationNumber = 0;
  profilPic: string = '';
  changedUsername = false;

  get apiUrl(): string {
    if(this.userId && this.nextCursor) {
      return `https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables=%7B%22id%22%3A%22${this.userId}%22%2C%22first%22%3A12%2C%22after%22%3A%22${this.nextCursor}%22%7D`
    }
    return '';
  }


  getMostLikedPic() {
    this.bestLikedPic = {
      numberOfLikes: 0,
      imageUrl: '',
      comment:''
    };
    this.nextCursor = 'QVFCQmkyNmsyOEFnYXA2alIzT216SEpacXFoWTQ4WnpEeXdSQ1dCSFlHc0twVjFOM3JXODZXemdoMkNwSG1WVWNrQ1RUR2RpX0ZEM0gtekJMWHBpX2JRSA==';
    axios.get(`https://instagram.com/${this.username}`).then(res => {
      this.getUserIdByScript(res.data);
      this.fetchImageFromInsta();
    });
  }

  getBestLikedPicForCurrentLoad(nodes) {
    nodes.forEach(({node}) => {
      if (this.bestLikedPic.numberOfLikes < node.edge_media_preview_like.count) {
        this.bestLikedPic.numberOfLikes = node.edge_media_preview_like.count;
        this.bestLikedPic.imageUrl = node.display_url;
        this.bestLikedPic.comment = node.edge_media_to_caption.edges[0].node.text;
      }
    });
  }

  fetchImageFromInsta() {
    axios.get(this.apiUrl).then((response) => {
      this.iterationNumber++;
      const data = response.data.data.user.edge_owner_to_timeline_media;
      this.getBestLikedPicForCurrentLoad(data.edges);
      if (data.page_info.has_next_page && this.iterationNumber < 200 && data.edges[0].node.owner.id === this.userId ) {
        this.nextCursor = data.page_info.end_cursor;
        this.cursors.push(this.nextCursor);
        setTimeout(() => {
          this.fetchImageFromInsta();
        }, 10);
      } else {
        return this.bestLikedPic;
      }
    });
  }

  getUserIdByScript(data){
    const parser = new DOMParser();
    const html = parser.parseFromString(data, 'text/html');
    const scripts = html.querySelectorAll('script');
    scripts.forEach(script => {
        try {
          this.userId = script.innerText.toString().split(`"id":`)[1].split(`"`)[1];
          this.profilPic = script.innerText.toString().split(`"profile_pic_url":`)[1].split(`"`)[1].replace(/\\u0026/g, '&');
        }
        catch (e) { }
    });
  }
}
