/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

const TOKEN_KEY = 'easy-wills-token';
const REFRESHTOKEN_KEY = 'easy-wills-refreshtoken';
const USER_KEY = 'easy-wills-user';
const USER_ROLE = 'userRole';
@Injectable({
    providedIn: 'root',
})
export class CookiesStorageService {
    constructor() {}

    public saveToken(token: string): void {
        // Cookie.set(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_KEY, token);

        const user = this.getUser();
        if (user) {
            this.saveUser({ ...user, token: token });
        }
    }
    public getToken(): string | null {
        // Cookie.get(TOKEN_KEY)
        return localStorage.getItem(TOKEN_KEY);
    }
    public saveRefreshToken(token: string): void {
        localStorage.setItem(REFRESHTOKEN_KEY, token);
        // Cookie.set(REFRESHTOKEN_KEY, token);
    }
    public getRefreshToken(): string | null {
        // Cookie.get(REFRESHTOKEN_KEY);
        return localStorage.getItem(REFRESHTOKEN_KEY);
    }

    public saveUser(user: any): void {
        // Cookie.set(USER_KEY, JSON.stringify(user));
        localStorage.setItem(USER_ROLE, user.roles[0].authority);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public saveUserProfile(profile: any) {
        localStorage.setItem('profile', JSON.stringify(profile));
    }

    public getUserProfile() {
        const userProfile = localStorage.getItem('profile');
        if (userProfile) {
            return JSON.parse(userProfile);
        }
        return null;
    }

    public getUserRole(): string | null {
        return localStorage.getItem(USER_ROLE);
    }
    public getUser(): any {
        // const user = Cookie.get(USER_KEY);
        const user = localStorage.getItem(USER_KEY);

        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    public clearStorage() {
        // Cookie.delete(TOKEN_KEY);
        // Cookie.delete(REFRESHTOKEN_KEY);
        // Cookie.delete(USER_KEY);
        // Cookie.deleteAll('/');
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESHTOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}
