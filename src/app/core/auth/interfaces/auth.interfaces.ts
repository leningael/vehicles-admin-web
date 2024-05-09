import { User } from "app/core/user/user.types";

export interface SignInResponse {
    access_token: string;
    token_type: string;
    user: User;
}