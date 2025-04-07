import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { map, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppResponseModel } from '../models'



// declare const process: {
//     env: {
//         API_URL: string;
//         APP_ENV: string;
//     };
// };
// console.log('API URL:', process?.env?.API_URL);

const routes = {
    login: 'api/v1/auth/sign-in',
    logout: 'auth/logout',
    refreshToken: 'auth/refresh?token=',
    forgotPassword: 'api/v1/auth/forgot-password?email=',
    resetPassword: 'api/v1/auth/reset-password',
    verifyEmail: 'api/v1/auth/verify-email?token=',
    changePassword: 'user/api/v1/change-password',
    profile: 'user/api/v1/profile',
    register: 'api/v1/auth/register',
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseURL = environment.API_URL;
    // public apiUrl = process.env.API_URL;
    //constructor(private http: HttpClient, private apiService: ApiService) {}

    private apiService = inject(ApiService);

    register(data: any) {
        const { name, email, password, passwordValid } = data;
        const payload = {
            name,
            email,
            password,
            passwordValid,
        };

        const url = this.baseURL + `${routes.register}`;
        return (
            this.apiService
                .post(url, payload)
                //return this.http.post<any>(url, payload)
                .pipe(map((res) => res))
        );
    }

    login(userDetails: { username: string; password: string }) {
        return this.apiService
            .post<any>(this.baseURL + routes.login, userDetails)
            .pipe(
                tap((user) => {
                    //   this.userSubject.next(user);
                    //   this.cookiesStorageService.clearStorage();
                    //   this.cookiesStorageService.saveRefreshToken(user.refreshToken);
                    //   this.cookiesStorageService.saveToken(user.token);
                    //   this.cookiesStorageService.saveUser(user);
                    // //console.log('hi')
                    // this.saveUserProfile();
                })
            );
    }

    saveUserProfile() {
        return this.apiService
            .get<any>(this.baseURL + `${routes.profile}`)
            .subscribe({
                next: (res) => {
                    // this.cookiesStorageService.saveUserProfile(res)
                },
            });
    }

    verifyToken(token: string) {
        return this.apiService.get(
            this.baseURL + `${routes.verifyEmail}${token}`
        );
    }

    forgotPassword(email: string) {
        return this.apiService.get<AppResponseModel<any>>(
          this.baseURL + `${routes.forgotPassword}${email}`
        );
      }
      resetPassword(payload: any) {
        return this.apiService.put<AppResponseModel<any>>(
          this.baseURL + routes.resetPassword,
          payload
        );
      }
}
