import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
    constructor() {}
}
