import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../utils/api.service';

declare global {
    interface Window {
        QoreIDWebSdk?: any;
        QoreIdRegenerateSDK?: () => void;
    }
}

@Injectable({ providedIn: 'root' })
export class QoreidService {
    private baseURL = environment.API_URL;
    private sdkLoaded = false;

    private apiService = inject(ApiService);

    constructor() {}

    /** Load QoreID Web SDK once (from the official docs URL) */
    loadSdk(): Observable<void> {
        return new Observable((observer) => {
            if (this.sdkLoaded || window.QoreIDWebSdk) {
                observer.next();
                observer.complete();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://dashboard.qoreid.com/qoreid-sdk/qoreid.js'; // per docs
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

    /**
     * Initialize identity verification session via your backend (documented).
     * Your backend returns: clientId, flowId, reference, applicantData, identityData...
     */
    initializeIdentity(payload: {
        idNumber: string;
        type: string;
        expiryDate: string;
    }): Observable<any> {
        const url = `${this.baseURL}api/v1/identity/initialize`;
        return this.apiService.post(url, payload);
    }

    /** Start QoreID verification modal */
    startVerification(): void {
        window.QoreIdRegenerateSDK?.();
        const sdk = window.QoreIDWebSdk;
        if (sdk) sdk.start();
        else console.warn('QoreIDWebSdk not available.');
    }
}
