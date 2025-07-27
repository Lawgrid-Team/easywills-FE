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
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { PersonalDetailsData, Witness } from '../../../../core/models/interfaces/will-data.interface';

@Component({
  selector: 'app-schedule-form',
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
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.scss'
})
export class ScheduleFormComponent {
  @Input() data!: PersonalDetailsData;
  @Input() witnesses: Witness[] = [];
  @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
  @Output() next = new EventEmitter<void>();
  @Output() setFormValidity = new EventEmitter<boolean>();
  @Output() validityChange = new EventEmitter<boolean>();
  //@Output() submitted = new EventEmitter<any>();
  @Output() submitted = new EventEmitter<{ date: string; time: string }>();

  timeOptions: string[] = [
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
    '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
    '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
];

  
  form!: FormGroup;

  minDate: Date = new Date(); // today



  constructor(private fb: FormBuilder) {}

  testatorName: string = '';

  ngOnInit(): void {
  this.testatorName = 'John Doe';
  this.form = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required]
  });

  // Dummy witnesses for now
  this.witnesses = [
    { 
      id: '1', 
      firstName: 'Alice', 
      lastName: 'Smith', 
      email: 'alice@example.com', 
      phoneNumber: '123-456-7890', 
      relationship: 'Friend' 
    },
    { 
      id: '2', 
      firstName: 'Bob', 
      lastName: 'Johnson', 
      email: 'bob@example.com', 
      phoneNumber: '987-654-3210', 
      relationship: 'Cousin' 
    }
  ];

  this.form.statusChanges.subscribe(() => {
    this.setFormValidity.emit(this.form.valid);
  });
}

 onSubmit(): void {
 if (this.form.valid) {
    this.submitted.emit(this.form.value);  // Pass data up to parent
  }
}

}




