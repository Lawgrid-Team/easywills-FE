import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-upgrade-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-upgrade-help.component.html',
  styleUrls: ['./plan-upgrade-help.component.scss'], // ✅ styleUrls (plural)
})
export class PlanUpgradeHelpComponent {
  images = {
    signValidate: 'svg/plansignup.svg',     // update to your actual file name/path if different
    planSelection: 'svg/upgrade.svg',     // update to your actual file name/path if different
  };

  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.router.navigateByUrl('/help').catch(() => this.location.back());
  }
}
