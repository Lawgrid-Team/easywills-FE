import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-validity-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-validity-help.component.html',
  styleUrls: ['./legal-validity-help.component.scss'],
})
export class LegalValidityHelpComponent {
  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.router.navigateByUrl('/help').catch(() => this.location.back());
  }
}