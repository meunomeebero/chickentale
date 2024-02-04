export class GoogleUser {
    email: string;
    email_verified: string;
    name: string;
    picture: string;

    constructor(data: GoogleUser) {
        this.email = data.email;
        this.email_verified = data.email_verified;
        this.name = data.name;
        this.picture = data.picture;
    }
}