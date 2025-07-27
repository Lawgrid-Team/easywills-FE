import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { IdentityVerificationData } from '../../../../core/models/interfaces/will-data.interface';
//import { WillDataService } from '../../../core/services/Wizard/will-data.service';

@Component({
  selector: 'app-verify-info',
  standalone: true,
  imports: [
    CommonModule,          
    ReactiveFormsModule,   
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './verify-info.component.html',
  styleUrl: './verify-info.component.scss'
})
export class VerifyInfoComponent {
  @Output() identitySaved = new EventEmitter<IdentityVerificationData>();
  @Output() next = new EventEmitter<void>();
  @Output() setFormValidity = new EventEmitter<boolean>();

  form: FormGroup;
  today = new Date();
  selectedDocumentType: string | null = null;
  hoveredDocumentType: string | null = null;

  idTypes = [
    { name: 'National ID Card', icon: 'id-card' },
    { name: 'National Passport', icon: 'passport' },
    { name: 'Driver\'s License', icon: 'license' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idType: [null, Validators.required],
      idNumber: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });

    this.form.statusChanges.subscribe(() => {
      this.setFormValidity.emit(this.form.valid);
    });
  }

  ngOnInit(): void {
    this.setFormValidity.emit(false);
  }

  selectDocument(type: string): void {
    this.selectedDocumentType = type;
    this.form.patchValue({ idType: type });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({ file });
  }

  submit(): void {
    if (this.form.valid) {
      const data: IdentityVerificationData = {
        documentType: this.form.value.idType,
        idNumber: this.form.value.idNumber,
        expiryDate: this.form.value.expiryDate
      };
      this.identitySaved.emit(data);
      this.next.emit();
      //console.log('Submit clicked', this.form.value);

    }
  }
}
