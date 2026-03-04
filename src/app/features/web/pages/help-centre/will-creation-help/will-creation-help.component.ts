import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-will-creation-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './will-creation-help.component.html',
  styleUrls: ['./will-creation-help.component.scss'],
})
export class WillCreationHelpComponent {
  images = {
    getStarted: 'svg/startwill.svg',
    signValidate: 'svg/willcomplete.svg',
  };

  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.router.navigateByUrl('/help').catch(() => this.location.back());
  }
}


