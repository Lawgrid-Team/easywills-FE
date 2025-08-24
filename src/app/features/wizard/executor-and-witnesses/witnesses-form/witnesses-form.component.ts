import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ExecutorAndWitnessData, Witness } from '../../../../core/models/interfaces/will-data.interface';

@Component({
  selector: 'app-witnesses-form',
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
    MatDatepickerModule,
    MatRadioModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './witnesses-form.component.html',
  styleUrl: './witnesses-form.component.scss',
})
export class WitnessesFormComponent {
  @Input() data!: ExecutorAndWitnessData;
  @Output() updateData = new EventEmitter<Partial<ExecutorAndWitnessData>>();
  @Output() next = new EventEmitter<void>();
  @Output() setFormValidity = new EventEmitter<boolean>();

  witnesses: Witness[] = [];
  isAddingWitness = false;
  editingWitnessId: string | null = null;

  witnessForm!: FormGroup;

  relationshipOptions = [
    { value: 'FRIEND', viewValue: 'Friend' },
    { value: 'RELATIVE', viewValue: 'Relative' },
    { value: 'COLLEAGUE', viewValue: 'Colleague' },
    { value: 'NEIGHBOR', viewValue: 'Neighbor' },
    { value: 'OTHER', viewValue: 'Other' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.witnesses = this.data?.witnesses || [];

    this.witnessForm = this.fb.group({
      type: ['individual', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      relationship: ['', Validators.required],
    });

    // Initial form validity
    this.setFormValidity.emit(true);
  }

  handleSaveWitness(): void {
    if (this.witnessForm.valid) {
      const witnessData = {
        ...this.witnessForm.value,
        id: this.editingWitnessId ?? '',
      } as Witness;

      if (this.editingWitnessId) {
        // Update existing witness
        this.witnesses = this.witnesses.map((w) =>
          w.id === this.editingWitnessId ? witnessData : w
        );
      } else {
        // Add new witness
        this.witnesses = [...this.witnesses, witnessData];
      }

      this.updateData.emit({ witnesses: this.witnesses });
      this.witnessForm.reset({ type: 'individual' });
      this.isAddingWitness = false;
      this.editingWitnessId = null;
    } else {
      this.witnessForm.markAllAsTouched();
    }
  }

  handleEditWitness(witness: Witness): void {
    this.witnessForm.patchValue({
      type: 'individual',
      firstName: witness.firstName,
      lastName: witness.lastName,
      email: witness.email,
      phoneNumber: witness.phoneNumber,
      relationship: witness.relationship,
    });
    this.editingWitnessId = witness.id;
    this.isAddingWitness = true;
  }

  handleAddWitness(): void {
    this.isAddingWitness = true;
    this.editingWitnessId = null;
    this.witnessForm.reset({ type: 'individual' });
  }

  onSubmit(): void {
    this.updateData.emit({ witnesses: this.witnesses });
    this.next.emit();
  }
}
