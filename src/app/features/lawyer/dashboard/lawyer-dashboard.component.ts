import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LawyerSidebarComponent } from '../sidebar/lawyer-sidebar.component';

@Component({
    selector: 'app-lawyer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterOutlet, LawyerSidebarComponent],
    templateUrl: './lawyer-dashboard.component.html',
    styleUrls: ['./lawyer-dashboard.component.scss'],
})
export class LawyerDashboardComponent {
    constructor() {}
}
