import {
    Component,
    EventEmitter,
    Output,
    OnInit,
    OnDestroy,
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectorRef,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';
import { IdentityVerificationData } from '../../../../core/models/interfaces/will-data.interface';
import {
    QoreIDConfig,
    QoreIdService,
    QoreIDVerificationResult,
} from '../../../../core/services/Wizard/qoreid.service';

@Component({
    selector: 'app-verify-info',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        MatNativeDateModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './verify-info.component.html',
    styleUrl: './verify-info.component.scss',
})
export class VerifyInfoComponent implements OnInit, OnDestroy {
    @Output() identitySaved = new EventEmitter<IdentityVerificationData>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    form: FormGroup;
    today = new Date();
    selectedDocumentType: string | null = null;
    hoveredDocumentType: string | null = null;
    private rawIdNumber: string = '';
    private destroy$ = new Subject<void>();

    // Verification state
    isVerifying = false;
    verificationStatus: 'idle' | 'verifying' | 'success' | 'error' = 'idle';
    verificationMessage = '';

    // QoreID Configuration - populated from API response
    qoreIdConfig: QoreIDConfig = {
        clientId: '',
        flowId: '',
        customerReference: '',
        applicantData: {
            firstname: '',
            lastname: '',
            email: '',
        },
        identityData: {
            lastname: '',
            idNumber: '',
        },
    };

    // Template binding getters
    get applicantDataJson(): string {
        return JSON.stringify(this.qoreIdConfig.applicantData);
    }

    get identityDataJson(): string {
        return JSON.stringify(this.qoreIdConfig.identityData);
    }

    idTypes = [
        { name: 'National ID Card', icon: 'id-card' },
        { name: 'National Passport', icon: 'passport' },
        { name: "Driver's License", icon: 'license' },
    ];

    private idFormats = {
        'National ID Card': {
            placeholder: '12345678901',
            maxLength: 11,
            pattern: /^\d{11}$/,
            errorMessage: 'National ID must be 11 digits',
            format: (value: string) =>
                value.replace(/\D/g, '').substring(0, 11),
        },
        'National Passport': {
            placeholder: 'A12345678',
            maxLength: 9,
            pattern: /^[A-C]\d{8}$/,
            errorMessage:
                'Passport must be 1 letter (A-C) followed by 8 digits',
            format: (value: string) => {
                const cleaned = value.toUpperCase().replace(/[^A-C0-9]/g, '');
                if (cleaned.length === 0) return '';
                if (cleaned.length === 1 && /[A-C]/.test(cleaned))
                    return cleaned;
                const letter = cleaned.charAt(0);
                const numbers = cleaned.substring(1).replace(/\D/g, '');
                return (
                    (letter.match(/[A-C]/) ? letter : '') +
                    numbers.substring(0, 8)
                );
            },
        },
        "Driver's License": {
            placeholder: 'ABC12345678901',
            maxLength: 14,
            pattern: /^[A-Z]{3}\d{11}$/,
            errorMessage:
                "Driver's License must be 3 letters followed by 11 digits",
            format: (value: string) => {
                const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (cleaned.length === 0) return '';
                const letters = cleaned.replace(/\d/g, '').substring(0, 3);
                const numbers = cleaned.replace(/[A-Z]/g, '').substring(0, 11);
                return letters + numbers;
            },
        },
    };

    constructor(
        private fb: FormBuilder,
        private qoreIdService: QoreIdService,
        private cdr: ChangeDetectorRef,
    ) {
        this.form = this.fb.group({
            idType: [null, Validators.required],
            idNumber: ['', Validators.required],
            expiryDate: ['', Validators.required],
        });

        this.form.statusChanges.subscribe(() => {
            this.setFormValidity.emit(this.form.valid);
        });
    }

    ngOnInit(): void {
        this.setFormValidity.emit(false);

        // Setup QoreID handlers
        this.qoreIdService.setupGlobalHandlers();

        // Subscribe to verification results
        this.qoreIdService
            .getVerificationResult()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                if (result) {
                    this.handleVerificationResult(result);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.qoreIdService.cleanupGlobalHandlers();
        this.qoreIdService.resetVerification();
    }

    /**
     * Handle verification result from QoreID
     */
    private handleVerificationResult(result: QoreIDVerificationResult): void {
        this.isVerifying = false;
        this.enableFormControls();

        switch (result.status) {
            case 'submitted':
                this.verificationStatus = 'success';
                this.verificationMessage = 'Verification successful!';
                this.cdr.detectChanges();

                setTimeout(() => {
                    this.proceedAfterVerification();
                }, 1500);
                break;

            case 'error':
                this.verificationStatus = 'error';
                this.verificationMessage =
                    'Verification failed. Please try again.';
                this.cdr.detectChanges();
                break;

            case 'closed':
                this.verificationStatus = 'idle';
                this.verificationMessage = 'Verification was cancelled.';
                this.cdr.detectChanges();
                break;
        }
    }

    /**
     * Proceed after successful verification
     */
    private proceedAfterVerification(): void {
        if (this.form.valid) {
            const data: IdentityVerificationData = {
                documentType: this.form.value.idType,
                idNumber: this.rawIdNumber,
                expiryDate: this.form.value.expiryDate,
                verificationStatus: 'verified',
                verifiedAt: new Date(),
                qoreIdReference: this.qoreIdConfig.customerReference,
            };
            this.identitySaved.emit(data);
            this.next.emit();
        }
    }

    private disableFormControls(): void {
        this.form.get('idNumber')?.disable();
        this.form.get('expiryDate')?.disable();
    }

    private enableFormControls(): void {
        this.form.get('idNumber')?.enable();
        this.form.get('expiryDate')?.enable();
    }

    submit(): void {
        if (!this.form.valid || this.isVerifying) {
            this.form.markAllAsTouched();
            return;
        }

        console.log('=== Starting Identity Verification ===');

        this.isVerifying = true;
        this.verificationStatus = 'verifying';
        this.verificationMessage = 'Initializing verification...';
        this.disableFormControls();

        if (!this.selectedDocumentType) {
            this.handleError('Please select a document type');
            return;
        }

        // Use getRawValue() to get all values including disabled controls
        const formValues = this.form.getRawValue();

        const request = {
            idNumber: this.rawIdNumber,
            type: this.qoreIdService.mapDocumentTypeToApiType(
                this.selectedDocumentType,
            ),
            expiryDate: this.qoreIdService.formatDateForApi(
                formValues.expiryDate,
            ),
        };

        // console.log('Request:', request);

        this.qoreIdService
            .initializeIdentity(request)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    console.log('API Response:', response);

                    this.qoreIdConfig =
                        this.qoreIdService.configureFromApiResponse(response);
                    this.verificationMessage = 'Starting verification...';
                    this.cdr.detectChanges();

                    setTimeout(() => {
                        this.startVerification();
                    }, 200);
                },
                error: (error) => {
                    console.error('API Error:', error);
                    this.handleError(
                        error.error?.message ||
                            'Failed to initialize verification. Please try again.',
                    );
                },
            });
    }

    /**
     * Start QoreID verification
     */
    private async startVerification(): Promise<void> {
        try {
            const started = await this.qoreIdService.startVerification();

            if (started) {
                this.verificationMessage = 'Verification in progress...';
                this.cdr.detectChanges();
            }
        } catch (error) {
            this.handleError(`Verification error: ${error}`);
        }
    }

    /**
     * Handle errors
     */
    private handleError(message: string): void {
        this.isVerifying = false;
        this.verificationStatus = 'error';
        this.verificationMessage = message;
        this.enableFormControls();
        this.cdr.detectChanges();
    }

    // ============== Form Helper Methods ==============

    getPlaceholderForSelectedType(): string {
        if (
            !this.selectedDocumentType ||
            !this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ]
        ) {
            return '0000 0000 0000 0000';
        }
        return this.idFormats[
            this.selectedDocumentType as keyof typeof this.idFormats
        ].placeholder;
    }

    getMaxLengthForSelectedType(): number {
        if (
            !this.selectedDocumentType ||
            !this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ]
        ) {
            return 20;
        }
        return this.idFormats[
            this.selectedDocumentType as keyof typeof this.idFormats
        ].maxLength;
    }

    getErrorMessageForSelectedType(): string {
        if (
            !this.selectedDocumentType ||
            !this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ]
        ) {
            return 'Please enter a valid ID number';
        }
        return this.idFormats[
            this.selectedDocumentType as keyof typeof this.idFormats
        ].errorMessage;
    }

    onIdNumberInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const rawValue = input.value;

        if (
            !this.selectedDocumentType ||
            !this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ]
        ) {
            return;
        }

        const formatter =
            this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ];
        const formattedValue = formatter.format(rawValue);

        this.rawIdNumber = formattedValue;
        this.form.patchValue(
            { idNumber: formattedValue },
            { emitEvent: false },
        );
        input.value = formattedValue;
        this.validateIdNumber(formattedValue);
    }

    getFormattedIdNumber(): string {
        return this.form.get('idNumber')?.value || '';
    }

    private validateIdNumber(value: string): void {
        if (
            !this.selectedDocumentType ||
            !this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ]
        ) {
            return;
        }

        const formatter =
            this.idFormats[
                this.selectedDocumentType as keyof typeof this.idFormats
            ];
        const isValid = formatter.pattern.test(value);

        const idControl = this.form.get('idNumber');
        if (idControl) {
            idControl.setErrors(isValid ? null : { pattern: true });
        }
    }

    selectDocument(type: string): void {
        if (this.isVerifying) return;

        this.selectedDocumentType = type;
        this.form.patchValue({ idType: type, idNumber: '' });
        this.rawIdNumber = '';
        this.verificationStatus = 'idle';
        this.verificationMessage = '';
    }
}
