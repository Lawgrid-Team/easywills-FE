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
    Child,
} from '../../../../core/models/interfaces/will-data.interface';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
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
    WizardHelpBoxComponent,
    HelpFAQ,
} from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { WizardHelpService } from '../../../../shared/services/wizard-help.service';

@Component({
    selector: 'app-children-form',
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
    templateUrl: './children-form.component.html',
    styleUrl: './children-form.component.scss',
})
export class ChildrenFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    hasChildren = false;
    children: Child[] = [];
    helpFAQs: HelpFAQ[] = [];
    isAddingChild = false;
    editingChildId: string | null = null;

    childForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private helpService: WizardHelpService
    ) {}

    ngOnInit(): void {
        // Initialize help FAQs
        this.helpFAQs = this.helpService.getFAQsForForm('children');

        this.hasChildren = this.data.hasChildren;
        this.children =
            this.data.children.length > 0 ? [...this.data.children] : [];
        this.isAddingChild =
            this.data.children.length === 0 && this.data.hasChildren;

        this.childForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            dateOfBirth: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        });

        // Initial form validity
        this.setFormValidity.emit(true);
    }

    handleHasChildrenChange(value: string): void {
        this.hasChildren = value === 'yes';

        if (this.hasChildren && this.children.length === 0) {
            this.isAddingChild = true;
        } else {
            this.isAddingChild = false;
        }

        this.updateData.emit({ hasChildren: this.hasChildren });
    }

    handleSaveChild(): void {
        if (this.childForm.valid) {
            if (this.editingChildId) {
                // Update existing child
                this.children = this.children.map((child) =>
                    child.id === this.editingChildId
                        ? { ...this.childForm.value, id: this.editingChildId }
                        : child
                );
            } else {
                // Add new child
                const newChild = {
                    ...this.childForm.value,
                    id: uuidv4(),
                } as Child;
                this.children = [...this.children, newChild];
            }

            this.updateData.emit({ children: this.children });
            this.childForm.reset();
            this.isAddingChild = false;
            this.editingChildId = null;
        }
    }

    handleEditChild(child: Child): void {
        this.childForm.patchValue({
            firstName: child.firstName,
            lastName: child.lastName,
            dateOfBirth: child.dateOfBirth,
            email: child.email,
        });
        this.editingChildId = child.id;
        this.isAddingChild = true;
    }

    handleAddAnotherChild(): void {
        this.isAddingChild = true;
        this.editingChildId = null;
        this.childForm.reset();
    }

    onSubmit(): void {
        this.updateData.emit({
            hasChildren: this.hasChildren,
            children: this.children,
        });
        this.next.emit();
    }
}
