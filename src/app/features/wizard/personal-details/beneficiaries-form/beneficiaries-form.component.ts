import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
    PersonalDetailsData,
    Beneficiary,
} from '../../../../core/models/interfaces/will-data.interface';
import {
    WizardHelpBoxComponent,
    HelpFAQ,
} from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { WizardHelpService } from '../../../../shared/services/wizard-help.service';

@Component({
    selector: 'app-beneficiaries-form',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCardModule,
        CommonModule,
        WizardHelpBoxComponent,
    ],
    templateUrl: './beneficiaries-form.component.html',
    styleUrl: './beneficiaries-form.component.scss',
})
export class BeneficiariesFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    beneficiaries: Beneficiary[] = [];
    helpFAQs: HelpFAQ[] = [];
    isAddingBeneficiary = false;
    editingBeneficiaryId: string | null = null;

    beneficiaryForm!: FormGroup;

    relationshipOptions = [
        { value: 'friend', viewValue: 'Friend' },
        { value: 'relative', viewValue: 'Relative' },
        { value: 'colleague', viewValue: 'Colleague' },
        { value: 'neighbor', viewValue: 'Neighbor' },
        { value: 'other', viewValue: 'Other' },
    ];

    constructor(
        private fb: FormBuilder,
        private helpService: WizardHelpService
    ) {}

    ngOnInit(): void {
        // Initialize help FAQs
        this.helpFAQs = this.helpService.getFAQsForForm('beneficiaries');
        this.beneficiaries = this.data.beneficiaries || [];

        this.beneficiaryForm = this.fb.group({
            type: ['INDIVIDUAL', Validators.required],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', Validators.required],
            relationship: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
        });

        // Add conditional validation based on beneficiary type
        this.beneficiaryForm.get('type')?.valueChanges.subscribe((type) => {
            const lastNameControl = this.beneficiaryForm.get('lastName');
            const dateOfBirthControl = this.beneficiaryForm.get('dateOfBirth');

            if (type === 'INDIVIDUAL') {
                lastNameControl?.setValidators([Validators.required]);
                dateOfBirthControl?.setValidators([Validators.required]);
            } else {
                lastNameControl?.clearValidators();
                dateOfBirthControl?.clearValidators();
            }

            lastNameControl?.updateValueAndValidity();
            dateOfBirthControl?.updateValueAndValidity();
        });

        // Initial form validity
        this.setFormValidity.emit(true);
    }

    handleSaveBeneficiary(): void {
        if (this.beneficiaryForm.valid) {
            if (this.editingBeneficiaryId) {
                // Update existing beneficiary
                this.beneficiaries = this.beneficiaries.map((beneficiary) =>
                    beneficiary.id === this.editingBeneficiaryId
                        ? {
                              ...this.beneficiaryForm.value,
                              id: this.editingBeneficiaryId,
                          }
                        : beneficiary
                );
            } else {
                // Add new beneficiary
                const newBeneficiary = {
                    ...this.beneficiaryForm.value,
                    // id: uuidv4(),
                } as Beneficiary;
                this.beneficiaries = [...this.beneficiaries, newBeneficiary];
            }

            this.updateData.emit({ beneficiaries: this.beneficiaries });
            this.beneficiaryForm.reset({ type: 'INDIVIDUAL' });
            this.isAddingBeneficiary = false;
            this.editingBeneficiaryId = null;
        }
    }

    handleEditBeneficiary(beneficiary: Beneficiary): void {
        this.beneficiaryForm.patchValue({
            type: beneficiary.type,
            firstName: beneficiary.firstName,
            lastName: beneficiary.lastName,
            relationship: beneficiary.relationship,
            dateOfBirth: beneficiary.dateOfBirth,
        });
        this.editingBeneficiaryId = beneficiary.id;
        this.isAddingBeneficiary = true;
    }

    handleAddBeneficiary(): void {
        this.isAddingBeneficiary = true;
        this.editingBeneficiaryId = null;
        this.beneficiaryForm.reset({ type: 'INDIVIDUAL' });
    }

    onSubmit(): void {
        this.updateData.emit({ beneficiaries: this.beneficiaries });
        this.next.emit();
    }
}
