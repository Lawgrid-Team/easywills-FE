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

    states = [
        { value: 'abia', viewValue: 'Abia' },
        { value: 'adamawa', viewValue: 'Adamawa' },
        { value: 'akwa-ibom', viewValue: 'Akwa Ibom' },
        { value: 'anambra', viewValue: 'Anambra' },
        { value: 'bauchi', viewValue: 'Bauchi' },
        { value: 'bayelsa', viewValue: 'Bayelsa' },
        { value: 'benue', viewValue: 'Benue' },
        { value: 'borno', viewValue: 'Borno' },
        { value: 'cross-river', viewValue: 'Cross River' },
        { value: 'delta', viewValue: 'Delta' },
        { value: 'ebonyi', viewValue: 'Ebonyi' },
        { value: 'edo', viewValue: 'Edo' },
        { value: 'ekiti', viewValue: 'Ekiti' },
        { value: 'enugu', viewValue: 'Enugu' },
        { value: 'gombe', viewValue: 'Gombe' },
        { value: 'imo', viewValue: 'Imo' },
        { value: 'jigawa', viewValue: 'Jigawa' },
        { value: 'kaduna', viewValue: 'Kaduna' },
        { value: 'kano', viewValue: 'Kano' },
        { value: 'katsina', viewValue: 'Katsina' },
        { value: 'kebbi', viewValue: 'Kebbi' },
        { value: 'kogi', viewValue: 'Kogi' },
        { value: 'kwara', viewValue: 'Kwara' },
        { value: 'lagos', viewValue: 'Lagos' },
        { value: 'nasarawa', viewValue: 'Nasarawa' },
        { value: 'niger', viewValue: 'Niger' },
        { value: 'ogun', viewValue: 'Ogun' },
        { value: 'ondo', viewValue: 'Ondo' },
        { value: 'osun', viewValue: 'Osun' },
        { value: 'oyo', viewValue: 'Oyo' },
        { value: 'plateau', viewValue: 'Plateau' },
        { value: 'rivers', viewValue: 'Rivers' },
        { value: 'sokoto', viewValue: 'Sokoto' },
        { value: 'taraba', viewValue: 'Taraba' },
        { value: 'yobe', viewValue: 'Yobe' },
        { value: 'zamfara', viewValue: 'Zamfara' },
        { value: 'fct', viewValue: 'FCT' },
    ];

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
