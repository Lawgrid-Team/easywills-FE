/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'easy-wills-token';
const REFRESHTOKEN_KEY = 'easy-wills-refreshtoken';
const USER_KEY = 'easy-wills-user';
const USER_ROLE = 'userRole';

@Injectable({
    providedIn: 'root',
})
export class CookiesStorageService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    private get storage(): Storage | null {
        return this.isBrowser ? localStorage : null;
    }

    public saveToken(token: string): void {
        if (!this.storage) return;

        this.storage.setItem(TOKEN_KEY, token);

        const user = this.getUser();
        if (user) {
            this.saveUser({ ...user, token });
        }
    }

    public getToken(): string | null {
        return this.storage ? this.storage.getItem(TOKEN_KEY) : null;
    }

    public saveRefreshToken(token: string): void {
        if (this.storage) {
            this.storage.setItem(REFRESHTOKEN_KEY, token);
        }
    }

    public getRefreshToken(): string | null {
        return this.storage ? this.storage.getItem(REFRESHTOKEN_KEY) : null;
    }

    public saveUser(user: any): void {
        if (!this.storage) return;

        if (user.roles?.[0]?.authority) {
            this.storage.setItem(USER_ROLE, user.roles[0].authority);
        }
        this.storage.setItem(USER_KEY, JSON.stringify(user));
    }

    public saveUserProfile(profile: any): void {
        this.storage?.setItem('profile', JSON.stringify(profile));
    }

    public getUserProfile(): any {
        const data = this.storage?.getItem('profile');
        return data ? JSON.parse(data) : null;
    }

    public getUserRole(): string | null {
        return this.storage ? this.storage.getItem(USER_ROLE) : null;
    }

    public getUser(): any {
        const data = this.storage?.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    }

    public clearStorage(): void {
        if (!this.storage) return;
        this.storage.removeItem(TOKEN_KEY);
        this.storage.removeItem(REFRESHTOKEN_KEY);
        this.storage.removeItem(USER_KEY);
        this.storage.removeItem(USER_ROLE);
        this.storage.removeItem('profile');
    }
}
