import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-recovery-help.component.html',
  styleUrls: ['./password-recovery-help.component.scss'],
})
export class PasswordRecoveryHelpComponent {
  images = {
    forgotPassword: 'svg/forgotpassword.svg',
    resetPassword: 'svg/resetpassword.svg',
    verifyOtp: 'svg/verifyotp.svg',
  };

  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.router.navigateByUrl('/help').catch(() => this.location.back());
  }
}