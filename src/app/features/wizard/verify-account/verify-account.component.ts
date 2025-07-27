import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';
import { ValidationStepsComponent } from './validation-steps/validation-steps.component';
import { VerifyInfoComponent } from './verify-info/verify-info.component';
import { VerifyIntroComponent } from './verify-intro/verify-intro.component';
import { Router } from '@angular/router';
//import { IdentityVerificationData } from '../../../../core/models/will-data.interface';
import { IdentityVerificationData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';




@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [
    ValidationStepsComponent, 
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    VerifyInfoComponent, 
    VerifyIntroComponent
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.scss'
})
export class VerifyAccountComponent {
  step = 0;
  isFormValid = false;
  showSuccessPopup = false;
  identityVerificationData!: IdentityVerificationData;

  constructor(
    private router: Router,
    private willDataService: WillDataService
  ) {}

  handleIdentitySave(data: IdentityVerificationData): void {
  this.identityVerificationData = data;
  this.willDataService.saveIdentityVerification(data);
  this.router.navigate(['/wiz/will/schedule']);
}

  
  ngOnInit(): void {
    this.isFormValid = true;
  }

  handleNext(): void {
    if (this.step === 2) {
      this.router.navigate(['/wiz/will/schedule']);
    } else {
      this.step++;
      this.isFormValid = false;
      window.scrollTo(0, 0);
    }
  }

  handleBack(): void {
    if (this.step > 0) {
      this.step--;
      this.isFormValid = true;
      window.scrollTo(0, 0);
    } else {
      this.router.navigate(['/wiz/will/verify-account']);
    }
  }

  setFormValidity(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  handleFormSubmit(formData: { date: string; time: string }): void {
    this.willDataService.saveScheduleInfo(formData);
    this.showSuccessPopup = true;
  }

  confirmAndRedirect(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/wiz/will/welcome']);
  }
}
