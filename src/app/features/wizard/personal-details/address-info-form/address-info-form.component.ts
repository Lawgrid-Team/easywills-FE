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

@Component({
    selector: 'app-address-info-form',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatCheckboxModule,
        CommonModule,
    ],
    templateUrl: './address-info-form.component.html',
    styleUrl: './address-info-form.component.scss',
})
export class AddressInfoFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    form!: FormGroup;

    cities = [
        { value: 'new-york', viewValue: 'New York' },
        { value: 'los-angeles', viewValue: 'Los Angeles' },
        { value: 'chicago', viewValue: 'Chicago' },
        { value: 'houston', viewValue: 'Houston' },
        { value: 'phoenix', viewValue: 'Phoenix' },
        { value: 'lagos', viewValue: 'Lagos' },
        { value: 'abuja', viewValue: 'Abuja' },
        { value: 'port-harcourt', viewValue: 'Port Harcourt' },
        { value: 'kano', viewValue: 'Kano' },
        { value: 'ibadan', viewValue: 'Ibadan' },
    ];

    states = [
        { value: 'new-york', viewValue: 'New York' },
        { value: 'california', viewValue: 'California' },
        { value: 'texas', viewValue: 'Texas' },
        { value: 'florida', viewValue: 'Florida' },
        { value: 'illinois', viewValue: 'Illinois' },
        { value: 'lagos', viewValue: 'Lagos' },
        { value: 'fct', viewValue: 'FCT' },
        { value: 'rivers', viewValue: 'Rivers' },
        { value: 'kano', viewValue: 'Kano' },
        { value: 'oyo', viewValue: 'Oyo' },
    ];

    countries = [
        { value: 'united-states', viewValue: 'United States' },
        { value: 'canada', viewValue: 'Canada' },
        { value: 'united-kingdom', viewValue: 'United Kingdom' },
        { value: 'australia', viewValue: 'Australia' },
        { value: 'nigeria', viewValue: 'Nigeria' },
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            streetAddress: [
                this.data.streetAddress || '',
                [Validators.required, Validators.minLength(5)],
            ],
            city: [this.data.city || '', Validators.required],
            state: [this.data.state || '', Validators.required],
            country: [this.data.country || 'nigeria', Validators.required],
        });

        // Update form validity whenever the form value changes
        this.form.statusChanges.subscribe(() => {
            this.setFormValidity.emit(this.form.valid);
        });

        // Initial form validity
        this.setFormValidity.emit(this.form.valid);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.updateData.emit(this.form.value);
            this.next.emit();
        }
    }
}
