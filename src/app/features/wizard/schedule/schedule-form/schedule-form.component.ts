import {WillDataService} from './../../../../core/services/Wizard/will-data.service';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import {PersonalDetailsData, Witness} from '../../../../core/models/interfaces/will-data.interface';
import {TimeUtils} from '../../../../shared/utils/time-utils';

type LocationType = 'HOME' | 'OFFICE';

interface PartnerOfficeVm {
  id: string;
  addressId: number;
  name: string;
    state: string;
    address: string;
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

  testatorName = '';
    minDate: Date = (() => {
        const now = new Date();
        const fromNow24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayPlus2 = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        // Use the later of "today + 2 days" or "24 hours from now"
        return fromNow24 > todayPlus2 ? fromNow24 : todayPlus2;
    })();

    locationType: LocationType | null = null;
    homeAddress = '';
    selectedCity: CityVm | null = null
    offices: PartnerOfficeVm[] = []

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
            address: '5400 Awolowo Road, Off Obafemi Isabu Crescent,',
            state: 'lagos'
        },
        {
          id: 'ikeja',
          addressId: 5768683288,
          name: 'Ikeja Branch Office',
            address: '18 Allen Avenue, Ikeja',
            state: 'lagos'
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
            address: 'Plot 12, CBD',
            state: 'abuja'
        },
      ],
    },
  ];

  timeOptions: string[] = [
      // '06:00 AM','06:30 AM','07:00 AM','07:30 AM',
      // '08:00 AM','08:30 AM','09:00 AM','09:30 AM',
    '10:00 AM','10:30 AM','11:00 AM','11:30 AM',
    '12:00 PM','12:30 PM','01:00 PM','01:30 PM',
    '02:00 PM','02:30 PM','03:00 PM','03:30 PM',
    '04:00 PM','04:30 PM','05:00 PM','05:30 PM',
      // '06:00 PM','06:30 PM','07:00 PM','07:30 PM',
      // '08:00 PM','08:30 PM','09:00 PM','09:30 PM',
      // '10:00 PM','10:30 PM','11:00 PM','11:30 PM'
  ];

    partnerAvailableTimeSlots = [];

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
        address: ['']
    });

    this.showInfoOnFirstLoad();

    this.form.statusChanges.subscribe(() => {
      const valid = this.form.valid && (this.canConfirmHome || this.canScheduleOffice);
      this.setFormValidity.emit(valid);
      this.validityChange.emit(valid);
    });

    this.form.get('cityId')?.valueChanges.subscribe(() => {
      this.form.get('officeId')?.setValue('');
    });

      // listen to date changes, needed for partner, to get the partner's availability for the selected date
      this.form.get('date')?.valueChanges.subscribe(() => {
          const date = new Date(this.form.get('date')?.value)
          if (this.form.get('officeId')?.value) {
              this.getPartnerAvailabilitySlot(this.form.get('officeId')?.value, TimeUtils.getDate_ISO(date))
          }

      })
      //listen to partner office changes to get availalbility for the newly selected partner
      this.form.get('officeId')?.valueChanges.subscribe(() => {
          const date = new Date(this.form.get('date')?.value)
          if (this.form.get('date')?.value) {
              this.getPartnerAvailabilitySlot(this.form.get('officeId')?.value, TimeUtils.getDate_ISO(date))
          }

      })
  }

  private buildFullAddress(): string {
    const street = (this.data?.streetAddress ?? '').trim();
    const city = (this.data?.city ?? '').trim();
    const state = (this.data?.state ?? '').trim();
    const country = (this.data?.country ?? '').trim();
    return [street, city, state, country].filter(Boolean).join(', ');
  }


  setLocation(type: LocationType) {
  this.locationType = type;

  if (type === 'HOME') {
      this.form.get('address')?.setValue(this.buildFullAddress());

    // clear office fields
    this.form.get('cityId')?.setValue('');
    this.form.get('officeId')?.setValue('');
  } else {
      this.form.get('address')?.setValue('');
    this.form.get('addressConfirmed')?.setValue(false);
  }
}

    async onCitySelected(cityId: any) {
        this.form.get('officeId')?.setValue('');
        try {
            const partners: any[] = await this.willdataService.getLegalPartnersByState(cityId);

            this.offices = (partners ?? []).map(p => ({
                id: p.addressId,
                addressId: p.addressId,
                name: p.organizationName ?? p.name ?? '',
                state: p.state,
                address: p.address ?? '',
            }));

            // keep selectedCity in sync if it exists in the local cities list
            this.selectedCity = this.cities.find(c => c.id === cityId) ?? null;
        } catch (err) {
            console.error('Failed to load partner offices', err);
            this.offices = [];
            this.selectedCity = null;
        }

    }


    async getPartnerAvailabilitySlot(officeId: any, date: any) {
        this.partnerAvailableTimeSlots = (await this.willdataService.getLegalPartnerAvailabilitySlot(officeId, date))
            .map((t: string) => TimeUtils.get24HoursTime(t))
    }

  get selectedOfficeId(): string | null {
    return this.form.get('officeId')?.value || null;
  }

  selectOffice(id: string) {
    this.form.get('officeId')?.setValue(id);
      console.log(id);

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

     if (!this.form.get('address')?.value || this.form.get('address')?.value?.trim().length < 5) {
         this.actionError = 'Please enter a valid address';
    return;
  }


  this.emitSubmittedPayload();
//   this.openSuccessDialog();
}

  actionError: string | null = null;

//   private getSelectedOfficeAddressId(): number | null {
//     const city = this.selectedCity;
//     const officeId = String(this.form.get('officeId')?.value ?? '');
//     const office = city?.offices.find(o => o.id === officeId);
//     return office?.addressId ?? null;
//   }



  scheduleOfficeAppointment() {
    if (!this.canScheduleOffice) return;

    this.emitSubmittedPayload();
    //this.openSuccessDialog();
  }

  private emitSubmittedPayload() {
  const dateVal = this.form.get('date')?.value;
      const address = this.form.get('address')?.value;
      const timeVal = this.form.get('time')?.value as string | null;
      const addressId = this.form.get('officeId')?.value; // selected office addressId

  if (!dateVal || !timeVal) {
    this.actionError = 'Please select a date and time.';
    return;
  }

  const dateStr =
    dateVal instanceof Date
        ? TimeUtils.getDate_ISO(dateVal)
      : String(dateVal);

      if (!address && !addressId) {
          this.actionError = 'Please select an office';
    return;
  }

  // emit API-shaped payload
      const payload: any = {
    date: dateStr,
          time: timeVal,
  };

      if (addressId) {
          payload['addressId'] = addressId
      } else {
          payload['address'] = address
      }

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
