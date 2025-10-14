import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
import {
    getCountries,
    getStatesForCountry,
    getCitiesForState,
} from '../../../../shared/data/address-data';

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

    countries: { value: string; viewValue: string }[] = [];
    states: { value: string; viewValue: string }[] = [];
    cities: { value: string; viewValue: string }[] = [];

    private isInitializing = true;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // Initialize countries
        this.countries = getCountries();

        console.log('Address form received data:', this.data);

        this.form = this.fb.group({
            streetAddress: [
                this.data.streetAddress || '',
                [Validators.required, Validators.minLength(5)],
            ],
            city: [
                { value: this.data.city || '', disabled: true },
                Validators.required,
            ],
            state: [
                { value: this.data.state || '', disabled: true },
                Validators.required,
            ],
            country: [this.data.country || '', Validators.required],
        });

        // Initialize states and cities based on existing data ONLY if we have data
        if (this.data.country) {
            // Populate dropdowns without triggering field clearing during initialization
            this.states = getStatesForCountry(this.data.country);
            this.form.get('state')?.enable();

            if (this.data.state) {
                this.cities = getCitiesForState(
                    this.data.country,
                    this.data.state
                );
                this.form.get('city')?.enable();
            }
        } else {
            // Ensure state and city are disabled initially
            this.form.get('state')?.disable();
            this.form.get('city')?.disable();
        }

        // React to country changes
        this.form.get('country')?.valueChanges.subscribe((selectedCountry) => {
            this.onCountryChange(selectedCountry);
        });

        // React to state changes
        this.form.get('state')?.valueChanges.subscribe((selectedState) => {
            this.onStateChange(selectedState);
        });

        this.form.statusChanges.subscribe(() => {
            console.log(
                'Form status changed - Valid:',
                this.form.valid,
                'Values:',
                this.form.value
            );

            // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
                this.setFormValidity.emit(this.form.valid);
                if (this.form.valid) {
                    this.updateData.emit(this.form.value);
                }
            });
        });

        console.log(
            'Initial form state - Valid:',
            this.form.valid,
            'Values:',
            this.form.value
        );

        // Mark initialization as complete
        setTimeout(() => {
            this.isInitializing = false;
            this.setFormValidity.emit(this.form.valid);
        });
    }

    onCountryChange(country: string): void {
        console.log('Country changed to:', country);

        if (country) {
            this.states = getStatesForCountry(country);
            this.cities = [];

            if (this.form) {
                // Enable state control and disable city control
                this.form.get('state')?.enable();
                this.form.get('city')?.disable();

                // Only clear fields if this is not during initialization
                if (!this.isInitializing) {
                    const currentState = this.form.get('state')?.value;
                    const currentCity = this.form.get('city')?.value;

                    // Clear state and city values when country changes
                    if (currentState || currentCity) {
                        console.log(
                            'Clearing state and city due to country change'
                        );
                        this.form.patchValue({
                            state: '',
                            city: '',
                        });

                        // Force form validation update
                        this.form.get('state')?.markAsTouched();
                        this.form.get('city')?.markAsTouched();
                        this.form.updateValueAndValidity();

                        // Use setTimeout to avoid change detection issues
                        setTimeout(() => {
                            console.log(
                                'Form validity after clearing:',
                                this.form.valid
                            );
                            this.setFormValidity.emit(this.form.valid);
                        });
                    }
                }
            }
        } else {
            this.states = [];
            this.cities = [];

            if (this.form) {
                // Disable both state and city controls when no country is selected
                this.form.get('state')?.disable();
                this.form.get('city')?.disable();
            }
        }
    }

    onStateChange(state: string): void {
        const country = this.form.get('country')?.value;
        if (country && state) {
            this.cities = getCitiesForState(country, state);

            if (this.form) {
                // Enable city control when state is selected
                this.form.get('city')?.enable();

                // Only clear city field if this is not during initialization
                if (!this.isInitializing) {
                    const currentCity = this.form.get('city')?.value;

                    // Clear city value when state changes
                    if (currentCity) {
                        console.log('Clearing city due to state change');
                        this.form.patchValue({
                            city: '',
                        });

                        // Force form validation update
                        this.form.get('city')?.markAsTouched();
                        this.form.updateValueAndValidity();

                        // Use setTimeout to avoid change detection issues
                        setTimeout(() => {
                            console.log(
                                'Form validity after clearing city:',
                                this.form.valid
                            );
                            this.setFormValidity.emit(this.form.valid);
                        });
                    }
                }
            }
        } else {
            this.cities = [];

            if (this.form) {
                // Disable city control when no state is selected
                this.form.get('city')?.disable();
            }
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.updateData.emit(this.form.value);
            this.next.emit();
        }
    }
}
