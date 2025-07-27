import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleIntroComponent } from './schedule-intro/schedule-intro.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PersonalDetailsData, Witness, ExecutorAndWitnessData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';

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
//export class ScheduleComponent {
  //step = 0;
    //data: PersonalDetailsData;
    //isFormValid = true;

   // personalDetails!: PersonalDetailsData;
    //executorAndWitnessData!: ExecutorAndWitnessData;
    //witnessList: Witness[] = [];



export class ScheduleComponent {
  step = 0;
  isFormValid = false;
  showSuccessPopup = false;

  personalDetails!: PersonalDetailsData;
  executorAndWitnessData!: ExecutorAndWitnessData;
  witnessList: Witness[] = [];

  constructor(
    private router: Router,
    private willDataService: WillDataService,
    private dialog: MatDialog // <-- Inject MatDialog here
  ) {}

  ngOnInit(): void {
    this.personalDetails = this.willDataService.getPersonalDetails();
    this.executorAndWitnessData = this.willDataService.getExecutorAndWitness();
    this.witnessList = this.executorAndWitnessData.witnesses || [];
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
  }
}
