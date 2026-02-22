import { inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../utils/api.service';

// ============== Interfaces ==============

export interface InitializeIdentityRequest {
    idNumber: string;
    type: 'NIN' | 'PASSPORT' | 'DRIVERS_LICENSE';
    expiryDate: string; // Format: 'YYYY-MM-DD'
}

export interface InitializeIdentityResponse {
    type: string;
    clientId: string;
    flowId: string;
    reference: string;
    applicantData: {
        email: string;
        firstname: string;
        lastname: string;
    };
    identityData: {
        idNumber: string;
        expiryDate: string;
        lastname: string;
    };
}

export interface QoreIDConfig {
    clientId: string;
    flowId: string;
    customerReference: string;
    applicantData: {
        firstname: string;
        lastname: string;
        phone?: string;
        email: string;
    };
    identityData: {
        lastname: string;
        idNumber: string;
        expiryDate?: string;
    };
}

export interface QoreIDVerificationResult {
    status: 'pending' | 'submitted' | 'error' | 'closed';
    data?: any;
    error?: any;
    timestamp: Date;
}

// Declare QoreID SDK functions
declare function QoreIdRegenerateSDK(): void;
declare namespace QoreIDWebSdk {
    function start(): void;
}

@Injectable({
    providedIn: 'root',
})
export class QoreIdService {
    private baseURL = environment.API_URL;
    private apiService = inject(ApiService);

    private verificationResult$ =
        new BehaviorSubject<QoreIDVerificationResult | null>(null);
    private currentConfig: QoreIDConfig | null = null;
    private handlersInitialized = false;

    constructor(private ngZone: NgZone) {}

    // ============== API Methods ==============

    /**
     * Initialize identity verification via API
     * Returns QoreID configuration from backend
     */
    initializeIdentity(
        request: InitializeIdentityRequest,
    ): Observable<InitializeIdentityResponse> {
        console.log('Calling /api/v1/identity/initialize with:', request);
        return this.apiService.post<InitializeIdentityResponse>(
            `${this.baseURL}v1/identity/initialize`,
            request,
        );
    }

    // ============== Configuration Methods ==============

    /**
     * Configure QoreID with API response
     */
    configureFromApiResponse(
        response: InitializeIdentityResponse,
    ): QoreIDConfig {
        const config: QoreIDConfig = {
            clientId: response.clientId,
            flowId: response.flowId,
            customerReference: response.reference,
            applicantData: {
                firstname: response.applicantData.firstname,
                lastname: response.applicantData.lastname,
                email: response.applicantData.email,
            },
            identityData: {
                lastname: response.identityData.lastname,
                idNumber: response.identityData.idNumber,
                expiryDate: response.identityData.expiryDate,
            },
        };

        this.currentConfig = config;
        console.log('QoreID configured with:', config);
        return config;
    }

    /**
     * Get current configuration
     */
    getCurrentConfig(): QoreIDConfig | null {
        return this.currentConfig;
    }

    // ============== SDK Methods ==============

    /**
     * Setup global QoreID event handlers
     * Must be called once when component initializes
     */
    setupGlobalHandlers(): void {
        if (this.handlersInitialized) {
            return;
        }

        (window as any).onQoreIDSdkSubmitted = (event: any) => {
            console.log('✅ QoreID Verification submitted:', event);
            this.ngZone.run(() => {
                this.verificationResult$.next({
                    status: 'submitted',
                    data: event,
                    timestamp: new Date(),
                });
            });
        };

        (window as any).onQoreIDSdkError = (event: any) => {
            console.error('❌ QoreID Verification error:', event);
            this.ngZone.run(() => {
                this.verificationResult$.next({
                    status: 'error',
                    error: event,
                    timestamp: new Date(),
                });
            });
        };

        (window as any).onQoreIDSdkClosed = (event: any) => {
            console.log('🚪 QoreID Verification closed:', event);
            this.ngZone.run(() => {
                this.verificationResult$.next({
                    status: 'closed',
                    data: event,
                    timestamp: new Date(),
                });
            });
        };

        this.handlersInitialized = true;
        console.log('QoreID global handlers initialized');
    }

    /**
     * Cleanup global handlers
     */
    cleanupGlobalHandlers(): void {
        delete (window as any).onQoreIDSdkSubmitted;
        delete (window as any).onQoreIDSdkError;
        delete (window as any).onQoreIDSdkClosed;
        this.handlersInitialized = false;
        console.log('QoreID global handlers cleaned up');
    }

    /**
     * Get verification result as observable
     */
    getVerificationResult(): Observable<QoreIDVerificationResult | null> {
        return this.verificationResult$.asObservable();
    }

    /**
     * Start QoreID verification
     * Returns a promise that resolves when SDK starts (or rejects on error)
     */
    startVerification(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                console.log('=== Starting QoreID SDK ===');

                // Check if button exists in DOM
                const button = document.getElementById('QoreIDButton');
                if (!button) {
                    throw new Error('QoreID button not found in DOM');
                }

                // Log current button attributes
                console.log('Button attributes:', {
                    clientId: button.getAttribute('clientId'),
                    flowId: button.getAttribute('flowId'),
                    customerReference: button.getAttribute('customerReference'),
                    applicantData: button.getAttribute('applicantData'),
                    identityData: button.getAttribute('identityData'),
                });

                // Check if SDK functions are available
                if (typeof QoreIdRegenerateSDK !== 'function') {
                    throw new Error(
                        'QoreIdRegenerateSDK is not available. Make sure the SDK script is loaded.',
                    );
                }

                // Regenerate SDK to read button attributes
                console.log('Calling QoreIdRegenerateSDK()...');
                QoreIdRegenerateSDK();

                // Start verification after SDK regenerates
                setTimeout(() => {
                    if (
                        typeof QoreIDWebSdk !== 'undefined' &&
                        typeof QoreIDWebSdk.start === 'function'
                    ) {
                        console.log('Calling QoreIDWebSdk.start()...');
                        QoreIDWebSdk.start();
                        resolve(true);
                    } else {
                        reject(
                            new Error('QoreIDWebSdk.start is not available'),
                        );
                    }
                }, 500);
            } catch (error) {
                console.error('QoreID Error:', error);
                this.verificationResult$.next({
                    status: 'error',
                    error: error,
                    timestamp: new Date(),
                });
                reject(error);
            }
        });
    }

    /**
     * Check if SDK is loaded and ready
     */
    isSdkReady(): boolean {
        return typeof QoreIdRegenerateSDK === 'function';
    }

    /**
     * Reset verification state
     */
    resetVerification(): void {
        this.verificationResult$.next(null);
        this.currentConfig = null;
    }

    // ============== Utility Methods ==============

    /**
     * Generate JSON string for applicant data (for template binding)
     */
    getApplicantDataJson(config: QoreIDConfig): string {
        return JSON.stringify(config.applicantData);
    }

    /**
     * Generate JSON string for identity data (for template binding)
     */
    getIdentityDataJson(config: QoreIDConfig): string {
        return JSON.stringify(config.identityData);
    }

    /**
     * Format date for API (YYYY-MM-DD)
     */
    formatDateForApi(date: Date | string): string {
        console.log('Formatting date for API:', date);
        if (!date) return '';

        const dateObj = date instanceof Date ? date : new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    /**
     * Map document type name to API type
     */
    mapDocumentTypeToApiType(
        documentType: string,
    ): 'NIN' | 'PASSPORT' | 'DRIVERS_LICENSE' {
        const typeMap: Record<string, 'NIN' | 'PASSPORT' | 'DRIVERS_LICENSE'> =
            {
                'National ID Card': 'NIN',
                'National Passport': 'PASSPORT',
                "Driver's License": 'DRIVERS_LICENSE',
            };
        return typeMap[documentType] || 'NIN';
    }
}
