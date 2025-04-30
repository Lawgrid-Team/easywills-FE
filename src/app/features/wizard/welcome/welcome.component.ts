import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {



    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    onGetStarted(): void {
        // Navigate to the first step of the wizard
        this.router.navigate(['/wiz/will']);
    }

}
