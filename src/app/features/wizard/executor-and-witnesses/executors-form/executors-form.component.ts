import { 
    Component,
    Input,
    Output,
    EventEmitter,
    type OnInit,} from '@angular/core';

import {
    FormBuilder,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { PersonalDetailsData, Executor } from '../../../../core/models/interfaces/will-data.interface';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-executors-form',
    standalone: true,
      imports: [
          MatFormFieldModule,
          MatInputModule,
          MatButtonModule,
          MatIconModule,
          ReactiveFormsModule,
          FormsModule,
          MatSelectModule,
          MatCheckboxModule,
          MatRadioModule,
          CommonModule,
          MatCardModule,
    ],
    templateUrl: './executors-form.component.html',
    styleUrl: './executors-form.component.scss',
})


export class ExecutorsFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    hasExecutor = false;
    executors: Executor[] = [];
    isAddingExecutor = false;
    editingExecutorId: string | null = null;

    executorForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.hasExecutor = this.data.hasExecutor;
        this.executors =
            this.data.executors.length > 0 ? [...this.data.executors] : [];
        this.isAddingExecutor =
            this.data.executors.length === 0 && this.data.hasExecutor;

        this.executorForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
            type: ['individual', Validators.required],
            address: ['', [Validators.required]],
        });

         // Add conditional validation based on executor type
        this.executorForm.get('type')?.valueChanges.subscribe((type) => {
            const lastNameControl = this.executorForm.get('lastName');
            const addressControl = this.executorForm.get('address');

            if (type === 'organization') {
                lastNameControl?.setValidators([Validators.required]);
                addressControl?.setValidators([Validators.required]);
            } else {
                lastNameControl?.clearValidators();
                addressControl?.clearValidators();
            }

            lastNameControl?.updateValueAndValidity();
            addressControl?.updateValueAndValidity();
        });

        // Initial form validity
        this.setFormValidity.emit(true);
    }

    handleHasExecutorChange(value: string): void {
        this.hasExecutor = value === 'yes';

        if (this.hasExecutor && this.executors.length === 0) {
            this.isAddingExecutor = true;
        } else {
            this.isAddingExecutor = false;
        }

        this.updateData.emit({ hasExecutor: this.hasExecutor });
    }

    handleSaveExecutor(): void {
        if (this.executorForm.valid) {
            if (this.editingExecutorId) {
                // Update existing executor
                this.executors = this.executors.map((executor) =>
                    executor.id === this.editingExecutorId
                        ? { ...this.executorForm.value, id: this.editingExecutorId }
                        : executor
                );
            } else {
                // Add new executor
                const newExecutor = {
                    ...this.executorForm.value,
                    id: uuidv4(),
                } as Executor;
                this.executors = [...this.executors, newExecutor];
            }

            this.updateData.emit({ executors: this.executors });
            this.executorForm.reset();
            this.isAddingExecutor = false;
            this.editingExecutorId = null;
        }
    }

    handleEditExecutor(executor: Executor): void {
        this.executorForm.patchValue({
            firstName: executor.firstName,
            lastName: executor.lastName,
            email: executor.email,
            phoneNumber: executor.phoneNumber,
        });
        this.editingExecutorId = executor.id;
        this.isAddingExecutor = true;
    }

    handleAddAnotherExecutor(): void {
        this.isAddingExecutor = true;
        this.editingExecutorId = null;
        this.executorForm.reset();
    }

    onSubmit(): void {
        this.updateData.emit({
            hasExecutor: this.hasExecutor,
            executors: this.executors,
        });
        this.next.emit();
    }
}

