import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { EstateDistributionData } from '../../../../core/models/interfaces/will-data.interface';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-asset-distribution-form',
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
    templateUrl: './asset-distribution-form.component.html',
    styleUrl: './asset-distribution-form.component.scss',
})
export class AssetDistributionFormComponent {
    @Input() data!: EstateDistributionData;
    @Output() updateData = new EventEmitter<Partial<EstateDistributionData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    sharingAsAWhole = true;
    

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.sharingAsAWhole = this.data.sharingAsAWhole;
  

        // Initial form validity
        this.setFormValidity.emit(true);
    }

    handleEstateDistributionType(value: string): void {
        this.sharingAsAWhole = value === 'yes';

    

        this.updateData.emit({ sharingAsAWhole: this.sharingAsAWhole });
    }

    

    onSubmit(): void {
        this.updateData.emit({
            sharingAsAWhole: this.sharingAsAWhole,

        });
        this.next.emit();
    }
}
