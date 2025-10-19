// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';
// import { environment } from '../../../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class QoreidService {
//     private baseURL = environment.API_URL;
//     private sdkUrl = 'https://dashboard.qoreid.com/qoreid-sdk/qoreid.js';
//     private sdkLoaded = false;

//     constructor(private http: HttpClient) {}

//     /** Load QoreID Web SDK dynamically */
//     loadSdk(): Promise<void> {
//         if (this.sdkLoaded || (window as any).QoreIDWebSdk)
//             return Promise.resolve();
//         return new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.src = this.sdkUrl;
//             script.async = true;
//             script.onload = () => {
//                 this.sdkLoaded = true;
//                 resolve();
//             };
//             script.onerror = (err) => reject(err);
//             document.body.appendChild(script);
//         });
//     }

//     /** Call backend /api/v1/identity/initialize */
//     async initializeIdentity(data: {
//         idNumber: string;
//         type: string;
//         expiryDate: string;
//     }): Promise<any> {
//         return await firstValueFrom(
//             this.http.post(this.baseURL + '/api/v1/identity/initialize', data)
//         );
//     }

//     /** Start QoreID verification */
//     startVerification(): void {
//         (window as any).QoreIdRegenerateSDK?.();
//         const sdk = (window as any).QoreIDWebSdk;
//         if (sdk) sdk.start();
//         else console.warn('QoreIDWebSdk not available');
//     }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

declare global {
    interface Window {
        QoreIDWebSdk?: any;
        QoreIdRegenerateSDK?: () => void;
    }
}

@Injectable({ providedIn: 'root' })
export class QoreidService {
    private baseURL = environment.API_URL;
    private sdkUrl = 'https://dashboard.qoreid.com/qoreid-sdk/qoreid.js';
    private sdkLoaded = false;

    constructor(private http: HttpClient) {}

    /** Load QoreID SDK script only once */
    loadSdk(): Observable<void> {
        return new Observable((observer) => {
            if (this.sdkLoaded || (window as any).QoreIDWebSdk) {
                observer.next();
                observer.complete();
                return;
            }

            const script = document.createElement('script');
            script.src = this.sdkUrl;
            script.async = true;
            script.onload = () => {
                this.sdkLoaded = true;
                observer.next();
                observer.complete();
            };
            script.onerror = (err) => observer.error(err);
            document.body.appendChild(script);
        });
    }

    /** POST call to backend to initialize QoreID identity */
    initializeIdentity(payload: {
        idNumber: string;
        type: string;
        expiryDate: string;
    }): Observable<any> {
        return this.http.post(
            this.baseURL + '/api/v1/identity/initialize',
            payload
        );
    }

    /** Trigger QoreID verification popup */
    startVerification(): void {
        window.QoreIdRegenerateSDK?.();
        const sdk = window.QoreIDWebSdk;
        if (sdk) {
            sdk.start();
        } else {
            console.warn('QoreIDWebSdk not available.');
        }
    }
}
