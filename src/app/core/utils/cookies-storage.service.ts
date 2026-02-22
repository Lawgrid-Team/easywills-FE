import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'easy-wills-token';
const REFRESHTOKEN_KEY = 'easy-wills-refreshtoken';
const USER_KEY = 'easy-wills-user';
const USER_ROLE = 'userRole';

@Injectable({
    providedIn: 'root',
})
export class CookiesStorageService {
    private platformId = inject(PLATFORM_ID);

    private get isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public saveToken(token: string): void {
        if (!this.isBrowser) return;

        localStorage.setItem(TOKEN_KEY, token);
        const user = this.getUser();
        if (user) {
            this.saveUser({ ...user, token: token });
        }
    }

    public getToken(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem(TOKEN_KEY);
    }

    public saveRefreshToken(token: string): void {
        if (!this.isBrowser) return;
        localStorage.setItem(REFRESHTOKEN_KEY, token);
    }

    public getRefreshToken(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem(REFRESHTOKEN_KEY);
    }

    public saveUser(user: any): void {
        if (!this.isBrowser) return;
        localStorage.setItem(USER_ROLE, user.roles[0].authority);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public saveUserProfile(profile: any): void {
        if (!this.isBrowser) return;
        localStorage.setItem('profile', JSON.stringify(profile));
    }

    public getUserProfile(): any {
        if (!this.isBrowser) return null;
        const userProfile = localStorage.getItem('profile');
        if (userProfile) {
            return JSON.parse(userProfile);
        }
        return null;
    }

    public getUserRole(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem(USER_ROLE);
    }

    public getUser(): any {
        if (!this.isBrowser) return null;
        const user = localStorage.getItem(USER_KEY);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    public clearStorage(): void {
        if (!this.isBrowser) return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESHTOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}
