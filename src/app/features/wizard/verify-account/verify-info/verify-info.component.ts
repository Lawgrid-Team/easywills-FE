import { Component, EventEmitter, Output } from '@angular/core';
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
import { IdentityVerificationData } from '../../../../core/models/interfaces/will-data.interface';
//import { WillDataService } from '../../../core/services/Wizard/will-data.service';

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
    templateUrl: './verify-info.component.html',
    styleUrl: './verify-info.component.scss',
})
export class VerifyInfoComponent {
    @Output() identitySaved = new EventEmitter<IdentityVerificationData>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    form: FormGroup;
    today = new Date();
    selectedDocumentType: string | null = null;
    hoveredDocumentType: string | null = null;
    private rawIdNumber: string = '';

    idTypes = [
        { name: 'National ID Card', icon: 'id-card' },
        { name: 'National Passport', icon: 'passport' },
        { name: "Driver's License", icon: 'license' },
    ];

    // Nigerian ID Format configurations
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

    constructor(private fb: FormBuilder) {
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
    }

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        this.form.patchValue({ file });
    }

    submit(): void {
        if (this.form.valid) {
            const data: IdentityVerificationData = {
                documentType: this.form.value.idType,
                idNumber: this.rawIdNumber, // Use raw unformatted value
                expiryDate: this.form.value.expiryDate,
            };
            this.identitySaved.emit(data);
            this.next.emit();
        }
    }

    // Nigerian ID Format Methods
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

        // Store raw value for validation
        this.rawIdNumber = formattedValue;

        // Update form control
        this.form.patchValue(
            { idNumber: formattedValue },
            { emitEvent: false }
        );

        // Set input value
        input.value = formattedValue;

        // Validate format
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
            if (isValid) {
                idControl.setErrors(null);
            } else {
                idControl.setErrors({ pattern: true });
            }
        }
    }

    selectDocument(type: string): void {
        this.selectedDocumentType = type;
        this.form.patchValue({ idType: type, idNumber: '' }); // Clear ID number when switching types
        this.rawIdNumber = ''; // Reset raw value
    }
}
