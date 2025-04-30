import {
    Component,
    Input,
    Output,
    EventEmitter,
    type OnInit,
} from '@angular/core';
import {
    FormBuilder,
    type FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { PersonalDetailsData } from '../../../../core/models/interfaces/will-data.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-birth-info-form',
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
        CommonModule,
    ],
    templateUrl: './birth-info-form.component.html',
    styleUrl: './birth-info-form.component.scss',
})
export class BirthInfoFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    form!: FormGroup;
    maxDate = new Date();

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            dateOfBirth: [
                this.data.dateOfBirth,
                [Validators.required, this.dateNotInFutureValidator],
            ],
            stateOfOrigin: [this.data.stateOfOrigin, Validators.required],
        });

        // Update form validity whenever the form value changes
        this.form.statusChanges.subscribe(() => {
            this.setFormValidity.emit(this.form.valid);
        });

        // Initial form validity
        this.setFormValidity.emit(this.form.valid);
    }

    dateNotInFutureValidator(control: any) {
        if (!control.value) return null;

        const selectedDate = new Date(control.value);
        const today = new Date();

        return selectedDate > today ? { futureDate: true } : null;
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.updateData.emit(this.form.value);
            this.next.emit();
        }
    }
}
