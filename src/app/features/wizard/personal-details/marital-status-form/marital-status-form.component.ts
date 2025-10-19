import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    PersonalDetailsData,
    Spouse,
} from '../../../../core/models/interfaces/will-data.interface';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {
    WizardHelpBoxComponent,
    HelpFAQ,
} from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { WizardHelpService } from '../../../../shared/services/wizard-help.service';

@Component({
    selector: 'app-marital-status-form',
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
    templateUrl: './marital-status-form.component.html',
    styleUrl: './marital-status-form.component.scss',
})
export class MaritalStatusFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    isMarried = false;
    spouses: Spouse[] = [];
    helpFAQs: HelpFAQ[] = [];
    isAddingSpouse = false;
    editingSpouseId: string | null = null;

    spouseForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private helpService: WizardHelpService
    ) {}

    ngOnInit(): void {
        // Initialize help FAQs
        this.helpFAQs = this.helpService.getFAQsForForm('marital-status');

        this.isMarried = this.data.isMarried;
        this.spouses =
            this.data.spouses.length > 0 ? [...this.data.spouses] : [];
        this.isAddingSpouse =
            this.data.spouses.length === 0 && this.data.isMarried;

        this.spouseForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            dateOfBirth: ['', Validators.required],
            dateOfMarriage: ['', Validators.required],
        });

        // Initial form validity
        this.setFormValidity.emit(true);
    }

    handleMaritalStatusChange(value: string): void {
        this.isMarried = value === 'yes';

        if (this.isMarried && this.spouses.length === 0) {
            this.isAddingSpouse = true;
        } else {
            this.isAddingSpouse = false;
        }

        this.updateData.emit({ isMarried: this.isMarried });
    }

    handleSaveSpouse(): void {
        if (this.spouseForm.valid) {
            if (this.editingSpouseId) {
                // Update existing spouse
                this.spouses = this.spouses.map((spouse) =>
                    spouse.id === this.editingSpouseId
                        ? { ...this.spouseForm.value, id: this.editingSpouseId }
                        : spouse
                );
            } else {
                // Add new spouse
                const newSpouse = {
                    ...this.spouseForm.value,
                    id: uuidv4(),
                } as Spouse;
                this.spouses = [...this.spouses, newSpouse];
            }

            this.updateData.emit({ spouses: this.spouses });
            this.spouseForm.reset();
            this.isAddingSpouse = false;
            this.editingSpouseId = null;
        }
    }

    handleEditSpouse(spouse: Spouse): void {
        this.spouseForm.patchValue({
            firstName: spouse.firstName,
            lastName: spouse.lastName,
            dateOfBirth: spouse.dateOfBirth,
            dateOfMarriage: spouse.dateOfMarriage,
        });
        this.editingSpouseId = spouse.id;
        this.isAddingSpouse = true;
    }

    handleAddAnotherSpouse(): void {
        this.isAddingSpouse = true;
        this.editingSpouseId = null;
        this.spouseForm.reset();
    }

    onSubmit(): void {
        this.updateData.emit({
            isMarried: this.isMarried,
            spouses: this.spouses,
        });
        this.next.emit();
    }
}
