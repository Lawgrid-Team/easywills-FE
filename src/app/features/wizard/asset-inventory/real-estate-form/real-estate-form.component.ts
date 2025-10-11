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

    cities = [
        { value: 'New York', viewValue: 'New York' },
        { value: 'Los Angeles', viewValue: 'Los Angeles' },
        { value: 'Chicago', viewValue: 'Chicago' },
        { value: 'Houston', viewValue: 'Houston' },
        { value: 'Phoenix', viewValue: 'Phoenix' },
    ];

    states = [
        { value: 'New York', viewValue: 'New York' },
        { value: 'California', viewValue: 'California' },
        { value: 'Texas', viewValue: 'Texas' },
        { value: 'Florida', viewValue: 'Florida' },
        { value: 'Illinois', viewValue: 'Illinois' },
    ];

    countries = [
        { value: 'United States', viewValue: 'United States' },
        { value: 'Canada', viewValue: 'Canada' },
        { value: 'United Kingdom', viewValue: 'United Kingdom' },
        { value: 'Australia', viewValue: 'Australia' },
        { value: 'Nigeria', viewValue: 'Nigeria' },
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            propertyType: ['', Validators.required],
            propertyTitle: ['', Validators.required],
            address: ['', [Validators.required, Validators.minLength(5)]],
            city: ['', Validators.required],
            state: ['', Validators.required],
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
            if (propertyToEdit) {
                this.form.patchValue(propertyToEdit);
            }
        }
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
}
