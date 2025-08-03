import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
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
        CommonModule,
    ],
    templateUrl: './address-info-form.component.html',
    styleUrl: './address-info-form.component.scss',
})
export class AddressInfoFormComponent implements OnInit {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    form!: FormGroup;

    cities: { value: string; viewValue: string }[] = [];

    stateCityMap: Record<string, { value: string; viewValue: string }[]> = {
        lagos: [
            { value: 'ikeja', viewValue: 'Ikeja' },
            { value: 'lekki', viewValue: 'Lekki' },
            { value: 'ikorodu', viewValue: 'Ikorodu' },
        ],
        fct: [
            { value: 'garki', viewValue: 'Garki' },
            { value: 'maitama', viewValue: 'Maitama' },
        ],
        rivers: [
            { value: 'port-harcourt', viewValue: 'Port Harcourt' },
            { value: 'obio-akpor', viewValue: 'Obio-Akpor' },
        ],
        kano: [
            { value: 'nassarawa', viewValue: 'Nassarawa' },
            { value: 'tarauni', viewValue: 'Tarauni' },
        ],
        oyo: [
            { value: 'ibadan', viewValue: 'Ibadan' },
            { value: 'oyo-town', viewValue: 'Oyo Town' },
        ],
        edo: [{ value: 'benin-city', viewValue: 'Benin City' }],
        enugu: [
            { value: 'enugu-north', viewValue: 'Enugu North' },
            { value: 'enugu-south', viewValue: 'Enugu South' },
        ],
        kaduna: [
            { value: 'kaduna-north', viewValue: 'Kaduna North' },
            { value: 'kaduna-south', viewValue: 'Kaduna South' },
        ],
    };

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

    countries = [{ value: 'nigeria', viewValue: 'Nigeria' }];

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

        // Populate cities if a state is already selected
        if (this.data.state) {
            this.cities = this.stateCityMap[this.data.state] || [];
        }

        // React to state changes
        this.form.get('state')?.valueChanges.subscribe((selectedState) => {
            this.cities = this.stateCityMap[selectedState] || [];
            this.form.get('city')?.setValue(''); // Reset city selection
        });

        this.form.statusChanges.subscribe(() => {
            this.setFormValidity.emit(this.form.valid);
        });

        this.setFormValidity.emit(this.form.valid);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.updateData.emit(this.form.value);
            this.next.emit();
        }
    }
}
