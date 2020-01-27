export class User {
    pk: string;
    username: string;
    // tslint:disable-next-line: variable-name
    full_name: string;
    // tslint:disable-next-line: variable-name
    profile_pic_url: string;
    // tslint:disable-next-line: variable-name
    is_verified: boolean;

    constructor(user = {} as User) {
        const { pk, username, full_name, profile_pic_url, is_verified } = user;
        this.pk = pk;
        this.username = username;
        this.full_name = full_name;
        this.profile_pic_url = profile_pic_url;
        this.is_verified = is_verified;
    }
}
