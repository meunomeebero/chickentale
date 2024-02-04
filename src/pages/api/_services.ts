import { GoogleUser } from "./_dtos";
import { HTTPError } from "./_error";

export const getMe = async (token: string) => {
    const data = await fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + token,
    );

    if (data.status !== 200) {
        const message = await data.text();
        throw new HTTPError({ message: "You must send a valid bearer token: " + message, code: 401 });
    }

    const json = await data.json();

    const user = new GoogleUser(json);

    return user
}