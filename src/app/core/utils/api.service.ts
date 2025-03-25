import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private get headers() {
        return {
            'Content-Type': 'application/json',
        };
    }
    private get fileHeaders() {
        return {
            enctype: 'multipart/form-data',
        };
    }
    private logRoutes(
        method: 'get' | 'post' | 'put' | 'delete' | 'patch',
        route: any,
        ...extras: any
    ) {}

    constructor(public http: HttpClient) {}

    private handleRequestError = (err: HttpErrorResponse) => {
        return throwError(() => err);
    };

    // FORMAT QUERY PARAMS
    formatQueryParams(parameters?: any) {
        if (!parameters) return '';
        let queryParams: any;
        const queryString = new HttpParams({
            fromObject: parameters,
        }).toString();
        return (queryParams = `?${queryString}`);
    }

    // PATCH
    patch<T = any>(route: string, body?: any, options?: any): Observable<T> {
        this.logRoutes('patch', route, body);

        return this.http.patch<T>(route, body, options).pipe(
            map((body: any) => body),
            catchError(this.handleRequestError)
        );
    }

    // POST
    post<T = any>(route: string, body?: any, options?: any): Observable<T> {
        this.logRoutes('post', route, body);
        return this.http
            .post<T>(
                encodeURI(route),
                body,
                options || {
                    headers: new HttpHeaders(this.headers),
                    responseType: 'json',
                }
            )
            .pipe(
                map((body: any) => body),
                catchError(this.handleRequestError)
            );
    }

    // POST FILE
    postFile<T = any>(route: string, body: FormData) {
        return this.post<T>(route, body, {
            headers: new HttpHeaders(this.fileHeaders),
            responseType: 'json',
        });
    }

    // PUT FILE
    putFile<T = any>(route: string, body: FormData) {
        return this.put<T>(route, body, {
            headers: new HttpHeaders(this.fileHeaders),
            responseType: 'json',
        });
    }

    // GET
    get = <T = any>(
        route: string,
        parameters?: Object,
        options?: any
    ): Observable<T> => {
        // this.logRoutes('get', route, parameters);
        const query = route + this.formatQueryParams(parameters);
        return this.http
            .get<T>(
                query,
                options || {
                    headers: new HttpHeaders(this.headers),
                    responseType: 'json',
                }
            )
            .pipe(
                map((body: any) => body),
                catchError(this.handleRequestError)
            );
    };

    // GET FILE
    getFile(url: string) {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map((body: any) => body),
            catchError(this.handleRequestError)
        );
    }

    //PUT
    put<T = any>(route: string, body?: any, options?: any): Observable<T> {
        this.logRoutes('put', route, body);
        return this.http
            .put<T>(route, body, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                responseType: 'json',
            })
            .pipe(
                map((body: any) => body),
                catchError(this.handleRequestError)
            );
    }

    // DELETE
    delete = <T = any>(route: string, options?: any) => {
        this.logRoutes('delete', route);
        return this.http
            .delete<T>(
                route,
                options || {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    }),
                    responseType: 'json',
                }
            )
            .pipe(
                map((body: any) => body),
                catchError(this.handleRequestError)
            );
    };
}
