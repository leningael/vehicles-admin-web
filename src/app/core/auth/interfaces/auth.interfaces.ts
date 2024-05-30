import { User } from "app/core/user/user.types";

export interface SignInResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface Candidate {
    name: string;
    last_name: string;
    email: string;
    password: string;
    invitation_code: string;
}