export class Post {
    numberOfLikes: number;
    imageUrl: string;
    comment: string;

    constructor(numberOfLikes = 0, imageUrl?, comment?) {
        this.numberOfLikes = numberOfLikes;
        this.imageUrl = imageUrl;
        this.comment = comment;
    }
}