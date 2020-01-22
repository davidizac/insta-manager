import { Component, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-insta-card',
  templateUrl: './insta-card.component.html',
  styleUrls: ['./insta-card.component.scss']
})
export class InstaCardComponent {

  constructor() { }

  @Input() post: Post;
  @Input() profilPic: string;

  get readableNumber(): string {
    const number = this.post.numberOfLikes.toString();
    return number.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  }

}
