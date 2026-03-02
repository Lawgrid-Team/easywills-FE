import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-security-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-security-help.component.html',
  styleUrls: ['./data-security-help.component.scss'],
})
export class DataSecurityHelpComponent {
  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.router.navigateByUrl('/help').catch(() => this.location.back());
  }
}
