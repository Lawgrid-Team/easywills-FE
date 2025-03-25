import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

// declare const process: {
//     env: {
//         API_URL: string;
//         APP_ENV: string;
//     };
// };

// console.log('API URL:', process?.env?.API_URL);
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseURL = environment.API_URL;
    // public apiUrl = process.env.API_URL;

    constructor(private http: HttpClient, private apiService: ApiService) {}

    private apService = inject(ApiService);

    register(data: any) {
        const { name, email, password, passwordValid } = data;
        const payload = {
            name,
            email,
            password,
            passwordValid
        };

        const url = this.baseURL + 'api/v1/auth/register';

        return this.apService.post(url, payload)
        //return this.http.post<any>(url, payload)
        .pipe(
            map((res) => res),
        );
    }
}
