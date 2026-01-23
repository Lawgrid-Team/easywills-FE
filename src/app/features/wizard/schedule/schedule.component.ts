import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../widget/footer/footer.component';
import {HeaderComponent} from '../widget/header/header.component';
import {ScheduleFormComponent} from './schedule-form/schedule-form.component';
import {ScheduleIntroComponent} from './schedule-intro/schedule-intro.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {SuccessDialogComponent} from './success-dialog/success-dialog.component';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {PersonalDetailsData, Witness} from '../../../core/models/interfaces/will-data.interface';
import {WillDataService} from '../../../core/services/Wizard/will-data.service';
import {NotificationService} from '../../../core/utils/notification.service';

@Component({
    selector: 'app-schedule',
    imports: [
        CommonModule,
        HeaderComponent,
        FooterComponent,
        ScheduleIntroComponent,
        ScheduleFormComponent,
        MatIconModule,
        MatDialogModule
    ],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss'
})


export class ScheduleComponent {
    step = 0;
    isFormValid = false;
    showSuccessPopup = false;

    personalDetails!: PersonalDetailsData;
    witnesses: Witness[] = [];

    private notification = inject(NotificationService);
    constructor(
        private router: Router,
        private willDataService: WillDataService,
        private dialog: MatDialog // <-- Inject MatDialog here
    ) { }

    async ngOnInit(): Promise<void> {
        this.willDataService.getTestator().subscribe({
            next: (data: any) =>{
                this.personalDetails = data;
            }
        });

        this.willDataService.getWitnesses().subscribe({
            next: (data: any) => {
                this.witnesses = data;
            }
        });

        this.isFormValid = true;
    }

    handleNext(): void {
        if (this.step === 0) {
            this.isFormValid = false;
        }
        this.step++;
        window.scrollTo(0, 0);
    }

    handleBack(): void {
        if (this.step === 0) {
            this.router.navigate(['/wiz/will/verify-account']);
        } else {
            this.step--;
        }
    }

    setFormValidity(isValid: boolean): void {
        this.isFormValid = isValid;
    }

    handleFormSubmit(formData: { date: string; time: string }): void {
        this.willDataService.saveScheduleInfo(formData);
        formData.time = this.convertTimeFormat(formData.time)

        this.willDataService.createSchedule(formData).subscribe({
            next: (response) => {
                //Open the success dialog
                const dialogRef = this.dialog.open(SuccessDialogComponent, {
                    width: '400px',
                    disableClose: true // must click OK
                });

                // After closing the dialog
                dialogRef.afterClosed().subscribe(() => {
                    this.router.navigate(['/dashboard']); // or this.step = 0;
                    // or);
                });
            },
            error: (err: any) => {
                this.notification.showError(err.error.message);
            }
        });


    }

    convertTimeFormat(timeString: string): string {
  // Create a Date object with a dummy date
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');

  // Parse hours as number for 24-hour conversion
  let hour = parseInt(hours);

  // Convert to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  // Format as HH:mm:ss
  return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
}

}
