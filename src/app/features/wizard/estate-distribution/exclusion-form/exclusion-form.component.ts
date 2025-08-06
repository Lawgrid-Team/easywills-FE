import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    type OnInit,
    Output,
} from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    type FormGroup,
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
import type {
    EstateDistributionData,
    Exclusion,
} from '../../../../core/models/interfaces/will-data.interface';

@Component({
    selector: 'app-exclusion-form',
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
    ],
    templateUrl: './exclusion-form.component.html',
    styleUrl: './exclusion-form.component.scss',
    standalone: true,
})
export class ExclusionFormComponent implements OnInit {
    @Input() data!: EstateDistributionData;
    @Output() updateData = new EventEmitter<EstateDistributionData>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    exclusionForm!: FormGroup;
    isAddingExclusion = false;
    editingIndex: number | null = null;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // Initialize exclusions array if it doesn't exist
        if (!this.data.exclusions) {
            this.data.exclusions = [];
        }

        this.initForm();
        this.checkFormValidity();
    }

    initForm(exclusion?: Exclusion): void {
        this.exclusionForm = this.fb.group({
            firstName: [exclusion?.firstName || '', Validators.required],
            lastName: [exclusion?.lastName || '', Validators.required],
            relationship: [exclusion?.relationship || '', Validators.required],
            reason: [exclusion?.reason || ''],
            legalDeclaration: [false, Validators.requiredTrue],
        });
    }

    startAddExclusion(): void {
        this.isAddingExclusion = true;
        this.editingIndex = null;
        this.initForm();
    }

    cancelAddExclusion(): void {
        this.isAddingExclusion = false;
        this.editingIndex = null;
    }

    saveExclusion(): void {
        if (this.exclusionForm.valid) {
            const formValue = this.exclusionForm.value;

            const exclusion: Exclusion = {
                id: uuidv4(),
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                relationship: formValue.relationship,
                reason: formValue.reason,
            };

            if (this.editingIndex !== null) {
                // Update existing exclusion
                this.data.exclusions[this.editingIndex] = {
                    ...this.data.exclusions[this.editingIndex],
                    ...exclusion,
                };
            } else {
                // Add new exclusion
                if (!this.data.exclusions) {
                    this.data.exclusions = [];
                }
                this.data.exclusions.push(exclusion);
            }

            this.updateData.emit(this.data);
            this.isAddingExclusion = false;
            this.editingIndex = null;
            this.checkFormValidity();
        }
    }

    editExclusion(index: number): void {
        this.editingIndex = index;
        this.isAddingExclusion = true;
        this.initForm(this.data.exclusions[index]);
    }

    removeExclusion(index: number): void {
        this.data.exclusions.splice(index, 1);
        this.updateData.emit(this.data);
        this.checkFormValidity();
    }

    getRelationshipLabel(value: string): string {
        const relationships: { [key: string]: string } = {
            spouse: 'Spouse',
            child: 'Child',
            parent: 'Parent',
            sibling: 'Sibling',
            friend: 'Friend',
            other: 'Other',
        };

        return relationships[value] || value;
    }

    checkFormValidity(): void {
        // Form is valid if there's at no exclusion (exclusion is optional) or if the user is currently adding one
        const isValid =
            this.data.exclusions?.length == 0 || this.isAddingExclusion;
        this.setFormValidity.emit(isValid);
    }
}
