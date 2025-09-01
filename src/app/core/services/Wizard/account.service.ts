import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../utils/api.service';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, type Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

const routes = {
    profile: 'api/v1/users/me',
    validateProfile: 'api/v1/users/validate-profile',
}

@Injectable({
    providedIn: 'root',
})
export class AccountService {
         private baseURL = environment.API_URL;
      private apiService = inject(ApiService);

      constructor() {}

    private accountSubject = new BehaviorSubject<any>(null);
    accountData$: Observable<any> = this.accountSubject.asObservable();

    private userDataSubject = new BehaviorSubject<any>(null);
    public userData$ = this.userDataSubject.asObservable();

    updateAccountData(data: Partial<any>): void {
            const currentData = this.accountSubject.value;
            this.accountSubject.next({
                ...currentData,
                ...data,
            });
        }

    validateProfile(): Observable<any>    {
            return this.apiService
            .get<any>(this.baseURL + routes.validateProfile)
            .pipe(
                tap((response) => {
                    this.updateAccountData({
                        plan: response.plan,
                        identityStatus: response.identityStatus
                    })
                })
            )

    }


    getAccountData(): any {

        if (!this.accountSubject.value) {
            this.fetchUserProfile();
        }
        return this.accountSubject.value;
    }

    getUserProfile(): any {
        if (!this.userDataSubject.value) {
            this.fetchUserProfile();
        }
        return this.userDataSubject.value;
    }

    updateUserProfile(data: any): void {
        const currentData = this.userDataSubject.value;
        this.userDataSubject.next({
            ...currentData,
            ...data
        });
    }

    fetchUserProfile() {
        this.apiService.get<any>(this.baseURL + routes.profile)
            .subscribe({
                next: (res: any) => {
                    this.updateUserProfile(res);
                }
            })
    }

}
