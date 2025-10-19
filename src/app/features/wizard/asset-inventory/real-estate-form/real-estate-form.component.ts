import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    AssetInventoryData,
    RealEstateProperty,
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
    getCountries,
    getStatesForCountry,
    getCitiesForState,
} from '../../../../shared/data/address-data';

@Component({
    selector: 'app-real-estate-form',
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
    templateUrl: './real-estate-form.component.html',
    styleUrl: './real-estate-form.component.scss',
})
export class RealEstateFormComponent implements OnInit {
    @Input() data!: AssetInventoryData;
    @Input() editingAssetId: string | null = null;
    @Output() updateData = new EventEmitter<Partial<AssetInventoryData>>();
    @Output() save = new EventEmitter<void>();

    form!: FormGroup;
    showForm = false;

    propertyTypes = [
        { value: 'Residential', viewValue: 'Residential' },
        { value: 'Commercial', viewValue: 'Commercial' },
        { value: 'Industrial', viewValue: 'Industrial' },
        { value: 'Land', viewValue: 'Land' },
        { value: 'Agricultural', viewValue: 'Agricultural' },
    ];

    propertyTitles = [
        {
            value: 'Certificate of Occupancy',
            viewValue: 'Certificate of Occupancy',
        },
        { value: 'Deed of Assignment', viewValue: 'Deed of Assignment' },
        { value: 'Lease Agreement', viewValue: 'Lease Agreement' },
        { value: 'Title Deed', viewValue: 'Title Deed' },
        { value: 'Other', viewValue: 'Other' },
    ];

    countries: { value: string; viewValue: string }[] = [];
    states: { value: string; viewValue: string }[] = [];
    cities: { value: string; viewValue: string }[] = [];

    private isInitializing = true;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // Initialize countries
        this.countries = getCountries();

        console.log('Real Estate Form - Received data:', this.data);
        console.log('Real Estate Properties:', this.data.realEstateProperties);

        this.form = this.fb.group({
            propertyType: ['', Validators.required],
            propertyTitle: ['', Validators.required],
            address: ['', [Validators.required, Validators.minLength(5)]],
            city: [{ value: '', disabled: true }, Validators.required],
            state: [{ value: '', disabled: true }, Validators.required],
            country: ['', Validators.required],
            ownershipType: ['Sole owner', Validators.required],
        });

        // Show form if no properties exist or if editing an existing property
        this.showForm =
            this.data.realEstateProperties.length === 0 ||
            this.editingAssetId !== null;

        if (this.editingAssetId) {
            const propertyToEdit = this.data.realEstateProperties.find(
                (property) => property.id === this.editingAssetId
            );
            console.log('Editing property:', propertyToEdit);
            if (propertyToEdit) {
                // Initialize address dropdowns based on existing data
                if (propertyToEdit.country) {
                    this.states = getStatesForCountry(propertyToEdit.country);
                    this.form.get('state')?.enable();

                    if (propertyToEdit.state) {
                        this.cities = getCitiesForState(
                            propertyToEdit.country,
                            propertyToEdit.state
                        );
                        this.form.get('city')?.enable();
                    }
                }

                this.form.patchValue(propertyToEdit);
            }
        }

        // React to country changes
        this.form.get('country')?.valueChanges.subscribe((selectedCountry) => {
            this.onCountryChange(selectedCountry);
        });

        // React to state changes
        this.form.get('state')?.valueChanges.subscribe((selectedState) => {
            this.onStateChange(selectedState);
        });

        // Mark initialization as complete
        setTimeout(() => {
            this.isInitializing = false;
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            if (this.editingAssetId) {
                // Update existing property
                const updatedProperties = this.data.realEstateProperties.map(
                    (property) =>
                        property.id === this.editingAssetId
                            ? ({
                                  ...this.form.value,
                                  id: this.editingAssetId,
                              } as RealEstateProperty)
                            : property
                );
                this.updateData.emit({
                    realEstateProperties: updatedProperties,
                });
            } else {
                // Add new property
                const newProperty = {
                    ...this.form.value,
                    id: uuidv4(),
                } as RealEstateProperty;
                this.updateData.emit({
                    realEstateProperties: [
                        ...this.data.realEstateProperties,
                        newProperty,
                    ],
                });
            }

            // After saving, hide form and show cards view instead of navigating away
            this.showForm = false;
            this.editingAssetId = null;
            this.form.reset();

            // Only emit save for overall completion, not individual property saves
            // this.save.emit();
        }
    }

    onAddAnother(): void {
        if (this.data.realEstateProperties.length > 0 && !this.showForm) {
            // When properties exist and form is not shown, show the form to add another
            this.showForm = true;
            this.editingAssetId = null; // Clear editing mode
            this.form.reset({
                propertyType: '',
                propertyTitle: '',
                address: '',
                city: '',
                state: '',
                country: '',
                ownershipType: 'Sole owner',
            });
        } else if (this.form.valid) {
            // Original behavior for when in form mode
            const newProperty = {
                ...this.form.value,
                id: uuidv4(),
            } as RealEstateProperty;
            this.updateData.emit({
                realEstateProperties: [
                    ...this.data.realEstateProperties,
                    newProperty,
                ],
            });

            // Reset form for next property
            this.form.reset({
                propertyType: '',
                propertyTitle: '',
                address: '',
                city: '',
                state: '',
                country: '',
                ownershipType: 'Sole owner',
            });
        }
    }

    editProperty(propertyId: string): void {
        // Set editing mode and populate form with property data
        this.editingAssetId = propertyId;
        this.showForm = true;
        const propertyToEdit = this.data.realEstateProperties.find(
            (property) => property.id === propertyId
        );
        if (propertyToEdit) {
            this.form.patchValue(propertyToEdit);
        }
    }

    saveAllProperties(): void {
        // Emit save event to parent component
        this.save.emit();
    }

    onCancel(): void {
        // Hide form and show cards view
        this.showForm = false;
        this.editingAssetId = null;
        this.form.reset();
    }

    deleteProperty(propertyId: string): void {
        // Remove the property from the data
        const updatedProperties = this.data.realEstateProperties.filter(
            (property) => property.id !== propertyId
        );
        this.updateData.emit({ realEstateProperties: updatedProperties });

        // If we were editing this property, clear the editing state
        if (this.editingAssetId === propertyId) {
            this.editingAssetId = null;
            this.showForm = false;
            this.form.reset();
        }

        // If no properties remain, show the form to add the first property
        if (updatedProperties.length === 0) {
            this.showForm = true;
        }
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
}
