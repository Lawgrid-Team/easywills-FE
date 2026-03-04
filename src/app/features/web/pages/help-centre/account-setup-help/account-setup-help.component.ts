import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-setup-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-setup-help.component.html',
  styleUrl: './account-setup-help.component.scss',
})
export class AccountSetupHelpComponent {
  images = {
    signup: 'svg/getstarted.svg',
    onboarding: 'svg/onboardfirst.svg',
  };

  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.router.navigateByUrl('/help').catch(() => {
      this.location.back();
    });
  }
}
