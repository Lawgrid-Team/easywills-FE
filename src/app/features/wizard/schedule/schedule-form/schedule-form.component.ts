import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PersonalDetailsData, Witness } from '../../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../../core/services/Wizard/will-data.service';

type LocationType = 'HOME' | 'OFFICE';

interface PartnerOfficeVm {
  id: string;
  addressId: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
}
interface CityVm {
  id: string;
  label: string;
  offices: PartnerOfficeVm[];
}

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
  ],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.scss',
})
export class ScheduleFormComponent implements OnInit {
  @Input() data!: PersonalDetailsData;
  @Input() witnesses: Witness[] = [];

  @Output() setFormValidity = new EventEmitter<boolean>();
  @Output() validityChange = new EventEmitter<boolean>();

  @Output() submitted = new EventEmitter<{
    date: string;
    time: string;
    locationType: LocationType;
    address?: number;
    cityId?: string;
    officeId?: string;
  }>();

  private readonly isBrowser: boolean;

  private readonly TEST_HOME_ADDRESS =
  '1234 Test Street, Ikeja, Lagos State, Nigeria';

  testatorName = '';
  minDate: Date = new Date();

  locationType: LocationType | null = null; 
  homeAddress = ''; 

  form!: FormGroup;

  cities: CityVm[] = [
    {
      id: 'lagos',
      label: 'Lagos State, Nigeria',
      offices: [
        {
          id: 'eosiwill-hq',
          addressId: 576868688,
          name: 'EosiWill Headquarter',
          addressLine1: '5400 Awolowo Road, Off Obafemi Isabu Crescent,',
          addressLine2: 'Lagos State. L899N0',
        },
        {
          id: 'ikeja',
          addressId: 5768683288,
          name: 'Ikeja Branch Office',
          addressLine1: '18 Allen Avenue, Ikeja',
          addressLine2: 'Lagos State.',
        },
      ],
    },
    {
      id: 'abuja',
      label: 'Abuja, Nigeria',
      offices: [
        {
          id: 'abuja-central',
          addressId:574568688,
          name: 'Central Business District Office',
          addressLine1: 'Plot 12, CBD',
          addressLine2: 'Abuja',
        },
      ],
    },
  ];

  timeOptions: string[] = [
    '06:00 AM','06:30 AM','07:00 AM','07:30 AM',
    '08:00 AM','08:30 AM','09:00 AM','09:30 AM',
    '10:00 AM','10:30 AM','11:00 AM','11:30 AM',
    '12:00 PM','12:30 PM','01:00 PM','01:30 PM',
    '02:00 PM','02:30 PM','03:00 PM','03:30 PM',
    '04:00 PM','04:30 PM','05:00 PM','05:30 PM',
    '06:00 PM','06:30 PM','07:00 PM','07:30 PM',
    '08:00 PM','08:30 PM','09:00 PM','09:30 PM',
    '10:00 PM','10:30 PM','11:00 PM','11:30 PM'
  ];

  // format time string to API expected object
formatTimeForApi(timeLabel: string) {
  const m = (timeLabel ?? '').trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!m) throw new Error(`Invalid time: "${timeLabel}"`);

  let h = +m[1], min = +m[2];
  const mer = m[3].toUpperCase();

  if (mer === 'PM' && h !== 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;

  return { hour: h, minute: min, second: 0, nano: 0 };
}



  constructor(
    private fb: FormBuilder,
    private willdataService: WillDataService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.testatorName = `${this.data?.firstName ?? ''} ${this.data?.lastName ?? ''}`.trim();

    this.form = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      addressConfirmed: [false],
      cityId: [''],
      officeId: [''],
    });

    // hard-coded witnesses for testing
    if (!this.witnesses || this.witnesses.length === 0) {
      this.witnesses = [
        {
          id: 'w1',
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice@example.com',
          phoneNumber: '123-456-7890',
          relationship: 'Friend',
        },
        {
          id: 'w2',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob@example.com',
          phoneNumber: '987-654-3210',
          relationship: 'Cousin',
        },
      ];
    }

    this.showInfoOnFirstLoad();

    this.form.statusChanges.subscribe(() => {
      const valid = this.form.valid && (this.canConfirmHome || this.canScheduleOffice);
      this.setFormValidity.emit(valid);
      this.validityChange.emit(valid);
    });

    this.form.get('cityId')?.valueChanges.subscribe(() => {
      this.form.get('officeId')?.setValue('');
    });
  }

  private buildFullAddress(): string {
    const street = (this.data?.streetAddress ?? '').trim();
    const city = (this.data?.city ?? '').trim();
    const state = (this.data?.state ?? '').trim();
    const country = (this.data?.country ?? '').trim();
    return [street, city, state, country].filter(Boolean).join(', ');
  }

  //setLocation(type: LocationType) {
  //  this.locationType = type;

   // if (type === 'HOME') {
   //   this.homeAddress = this.buildFullAddress();
   //   this.form.get('cityId')?.setValue('');
   //   this.form.get('officeId')?.setValue('');
   // } else {
    //  this.homeAddress = '';
    //  this.form.get('addressConfirmed')?.setValue(false);
   // }
  //}

  //Fixed address for testing
  setLocation(type: LocationType) {
  this.locationType = type;

  if (type === 'HOME') {
    // Hard-coded address for testing
    this.homeAddress = this.TEST_HOME_ADDRESS;

    // clear office fields
    this.form.get('cityId')?.setValue('');
    this.form.get('officeId')?.setValue('');
  } else {
    this.homeAddress = '';
    this.form.get('addressConfirmed')?.setValue(false);
  }
}


  get selectedCity(): CityVm | null {
    const cityId = this.form.get('cityId')?.value;
    return this.cities.find((c) => c.id === cityId) ?? null;
  }

  get selectedOfficeId(): string | null {
    return this.form.get('officeId')?.value || null;
  }

  selectOffice(id: string) {
    this.form.get('officeId')?.setValue(id);
  }

  get canConfirmHome(): boolean {
    if (this.locationType !== 'HOME') return false;
    if (!this.form.get('date')?.valid || !this.form.get('time')?.valid) return false;

    const confirmed = this.form.get('addressConfirmed')?.value === true;
    const addrOk = (this.homeAddress ?? '').trim().length > 5;
    return confirmed && addrOk;
  }

  get canScheduleOffice(): boolean {
    if (this.locationType !== 'OFFICE') return false;
    if (!this.form.get('date')?.valid || !this.form.get('time')?.valid) return false;

    const cityOk = String(this.form.get('cityId')?.value ?? '').trim().length > 0;
    const officeOk = String(this.form.get('officeId')?.value ?? '').trim().length > 0;
    return cityOk && officeOk;
  }

  //confirmHomeAddress() {
  //  if (!this.canConfirmHome) return;
  //  this.emitSubmittedPayload();
  //  this.openSuccessDialog();
 // }

 confirmHomeAddress(): void {
  this.actionError = null;

  // Mark fields touched so validation states update
  this.form.get('date')?.markAsTouched();
  this.form.get('time')?.markAsTouched();
  this.form.get('addressConfirmed')?.markAsTouched();

  if (this.locationType !== 'HOME') {
    this.actionError = 'Please select "My Home or Office" first.';
    return;
  }

  if (this.form.get('date')?.invalid || this.form.get('time')?.invalid) {
    this.actionError = 'Please select a date and time to continue.';
    return;
  }

  if (this.form.get('addressConfirmed')?.value !== true) {
    this.actionError = 'Please tick the checkbox to confirm your address.';
    return;
  }

  if (!this.homeAddress || this.homeAddress.trim().length < 5) {
    this.actionError = 'No valid address was found in your personal details.';
    return;
  }

  
  this.emitSubmittedPayload();
  this.openSuccessDialog();
}

  actionError: string | null = null;

  private getSelectedOfficeAddressId(): number | null {
    const city = this.selectedCity;
    const officeId = String(this.form.get('officeId')?.value ?? '');
    const office = city?.offices.find(o => o.id === officeId);
    return office?.addressId ?? null;
  }



  scheduleOfficeAppointment() {
    if (!this.canScheduleOffice) return;
    this.emitSubmittedPayload();
    //this.openSuccessDialog();
  }

  private emitSubmittedPayload() {
  const dateVal = this.form.get('date')?.value;
  const timeVal = this.form.get('time')?.value as string | null; 

  if (!dateVal || !timeVal) {
    this.actionError = 'Please select a date and time.';
    return;
  }

  let apiTime: { hour: number; minute: number; second: number; nano: number };
  try {
    apiTime = this.formatTimeForApi(timeVal); 
  } catch {
    this.actionError = 'Invalid time selected. Please pick a time from the list.';
    return;
  }

  const dateStr =
    dateVal instanceof Date
      ? `${dateVal.getFullYear()}-${String(dateVal.getMonth() + 1).padStart(2, '0')}-${String(dateVal.getDate()).padStart(2, '0')}`
      : String(dateVal);

 
  const addressId =
    this.locationType === 'HOME'
      ? 9007199254740991 // test home addressId for now (replace with real)
      : this.getSelectedOfficeAddressId(); // selected office addressId

  if (!addressId) { 
    this.actionError = 'Please select an office.';
    return;
  }

  // emit API-shaped payload
  const payload = {
    addressId: Number(addressId), 
    date: dateStr,
    time: apiTime,
  };

  // this.scheduleRequested.emit(payload);
  this.submitted.emit(payload as any);

  console.log('Submitted payload:', payload);
}


  openInfoDialog() {
    this.dialog.open(ScheduleInfoDialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '420px',
      maxHeight: '80vh',
      panelClass: 'rounded-2xl',
    });
  }

  private openSuccessDialog() {
    const ref = this.dialog.open(ScheduleSuccessDialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '420px',
      maxHeight: '80vh',
      disableClose: true,
      panelClass: 'rounded-2xl',
      data: {
        message: 'Your signature date has been scheduled successfully, all witnesses will be notified.',
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result === 'dashboard') {
       
        window.location.href = '/dashboard';
      }
    });
  }

  private showInfoOnFirstLoad() {
   if (!this.isBrowser) return;

   const KEY = 'ew_schedule_info_seen';
    if (sessionStorage.getItem(KEY)) return;

   sessionStorage.setItem(KEY, '1');
    setTimeout(() => this.openInfoDialog(), 0);
  //}
  //ngAfterViewInit(): void {
  //setTimeout(() => this.openInfoDialog(), 0);
}
}

/** Info dialog */
@Component({
  selector: 'app-schedule-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <div class="relative w-[520px] max-w-[92vw] bg-white rounded-2xl p-8">
      <button mat-icon-button class="!absolute right-3 top-3" (click)="close()" aria-label="Close">
        <mat-icon>close</mat-icon>
      </button>

      <!-- Image (replaces the map icon area) -->
      <div class="w-full h-[140px] rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
        <img
          src="svg/pana.svg"
          alt="Why we need this information"
          class="h-full w-full object-contain"
        />
      </div>

      <h3 class="mt-6 text-lg font-semibold text-gray-900">Why We Need This information</h3>
      <p class="mt-2 text-sm text-gray-600 leading-5">
        You can choose where you want to sign your will. It can be at your home or at the lawyer’s office.
      </p>
      <p class="mt-4 text-sm text-gray-600 leading-5">
        Pick the place that feels safe and comfortable for you. This helps us know where to meet you on the day you choose.
      </p>
    </div>
  `,
})
export class ScheduleInfoDialogComponent {
  constructor(private ref: MatDialogRef<ScheduleInfoDialogComponent>) {}

  close() {
    this.ref.close();
  }
}

/** @Component({
  selector: 'app-schedule-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <div class="relative w-[520px] max-w-[92vw] bg-white rounded-2xl p-8">
      <button mat-icon-button class="!absolute right-3 top-3" (click)="close()" aria-label="Close">
        <mat-icon>close</mat-icon>
      </button>

      <div class="w-full h-[140px] rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
        <mat-icon class="text-gray-300" style="font-size:64px;width:64px;height:64px;">map</mat-icon>
      </div>

      <h3 class="mt-6 text-lg font-semibold text-gray-900">Why We Need This information</h3>
      <p class="mt-2 text-sm text-gray-600 leading-5">
        You can choose where you want to sign your will. It can be at your home or at the lawyer’s office.
      </p>
      <p class="mt-4 text-sm text-gray-600 leading-5">
        Pick the place that feels safe and comfortable for you. This helps us know where to meet you on the day you choose.
      </p>
    </div>
  `,
})
export class ScheduleInfoDialogComponent {
  constructor(private ref: MatDialogRef<ScheduleInfoDialogComponent>) {}
  close() { this.ref.close(); }
} */

/** Success dialog */
@Component({
  selector: 'app-schedule-success-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <div class="bg-white rounded-2xl p-8 text-center w-full">
      <div class="mx-auto w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center">
        <mat-icon class="text-gray-800">check</mat-icon>
      </div>

      <h3 class="mt-4 text-lg font-semibold text-gray-900">Success</h3>
      <p class="mt-2 text-sm text-gray-600 leading-5">
        {{ data.message }}
      </p>

      <button
        mat-raised-button
        class="mt-8 w-full !rounded-lg !bg-[#2F2F2F] !text-white"
        (click)="goDashboard()"
      >
        Return to Dashboard
      </button>
    </div>
  `,
})
export class ScheduleSuccessDialogComponent {
  constructor(
    private ref: MatDialogRef<ScheduleSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  goDashboard() {
    this.ref.close('dashboard');
  }
}
