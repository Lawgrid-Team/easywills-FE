/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../utils/notification.service';
import { AuthUser } from '../models/interfaces/user.interface';
import { CookiesStorageService } from '../utils/cookies-storage.service';
// import { CookiesStorageService } from '../../shared/services/cookies-storage.service';

// This is the key that will be used to set the Authorization header
// when making HTTP requests that require authentication
// It is typically a Bearer token that is sent in the request headers
// to authenticate the user with the server.
// The value of this key will be set to 'Bearer ' followed by the access token
// retrieved from the cookies storage service.
// This allows the server to verify the user's identity and grant access to protected resources.
// The key is defined as a constant to ensure consistency and avoid typos
// throughout the codebase.
const TOKEN_HEADER_KEY = 'Authorization';

const CODEMESSAGE: Record<number, string> = {
    0: 'Service temporarily unavailable, please try again!',
    403: 'Forbidden!',
    500: 'Internal Server Error',
    502: 'Gateway Error',
    503: 'The resource is unavailable',
    504: 'The resource is timed out',
};
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);
    constructor(
        private cookiesStorageService: CookiesStorageService,
        private authService: AuthService,
        private notify: NotificationService
    ) {}

    /**
     * Intercepts HTTP requests and adds the authentication token to the request headers.
     * If the request fails with a 401 status, it attempts to refresh the token and retry the request.
     * If the refresh fails, it logs out the user.
     *
     * @param request The outgoing HTTP request.
     * @param next The next handler in the chain.
     * @returns An observable of the HTTP event.
     */
    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const authReq = this.addAuthenticationToken(request);
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                let err: any;
                if (
                    request.url.includes('auth/refresh') ||
                    request.url.includes('auth/signin') ||
                    request.url.includes('auth/reset-password') ||
                    request.url.includes('auth/verify-email') ||
                    request.url.includes('auth/forgot-password')
                ) {
                    // We do another check to see if refresh token failed
                    // In this case we want to logout user and to redirect it to login page
                    if (
                        error.status == 401 &&
                        !request.url.includes('auth/refresh')
                    ) {
                        err = this.formatError(error);

                        return throwError(() => err);
                    }
                    if (request.url.includes('auth/refresh')) {
                        this.authService.onLogout();
                    }
                    err = this.formatError(error);

                    return throwError(() => err);
                }

                // If error status is different than 401 we want to skip refresh token
                // So we check that and throw the error if it's the case
                if (error.status !== 401) {
                    err = this.formatError(error);
                    return throwError(() => err);
                }

                if (this.isRefreshing) {
                    // If isRefreshing is true, we will wait until refreshTokenSubject has a non-null value
                    // – which means the new token is ready and we can retry the request again
                    return this.refreshTokenSubject.pipe(
                        filter((result: null) => result !== null),
                        take(1),
                        switchMap(() =>
                            next.handle(this.addAuthenticationToken(request))
                        )
                    );
                } else {
                    this.isRefreshing = true;

                    // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                    this.refreshTokenSubject.next(null);

                    // Call auth.refreshAccessToken
                    return this.authService.refreshToken().pipe(
                        switchMap((user: AuthUser) => {
                            //When the call to refreshToken completes we reset the isRefreshing to false
                            // for the next time the token needs to be refreshed and save to local storage
                            this.isRefreshing = false;
                            this.refreshTokenSubject.next(user.token);
                            this.cookiesStorageService.saveToken(user.token);
                            // //console.log('refresh token fetched');

                            return next.handle(
                                this.addAuthenticationToken(request)
                            );
                        }),
                        catchError((error: HttpErrorResponse) => {
                            this.isRefreshing = false;
                            // //console.log('Error in the refresh token', error);
                            const err = this.formatError(error);

                            this.authService.onLogout();
                            return throwError(() => err);
                        })
                    );
                }
            })
        );
    }

    addAuthenticationToken(request: HttpRequest<unknown>) {
        // Get access token from Local Storage
        const accessToken = this.cookiesStorageService.getToken();

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }

        // We clone the request
        return request.clone({
            headers: request.headers.set(
                TOKEN_HEADER_KEY,
                'Bearer ' + accessToken
            ),
        });
    }
    formatError(error: HttpErrorResponse) {
        //console.log('error', error);
        const error_message = error.error.size
            ? error.statusText
            : error.error.message
            ? error.error.message
            : error.error.errors
            ? error.error.errors
                  .map((err: string) => {
                      const errors = err.split(',');
                      return errors.length > 1 ? errors[1].trim() : errors[0];
                  })
                  .join()
                  .replace(',', '. ')
            : null;
        const errortext = error_message || CODEMESSAGE[error.status];
        this.notify.showError(errortext);
        return { ...error, msg: errortext };
    }
}
