import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
    ],
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
    activeTab: 'upcoming' | 'completed' = 'upcoming';
    searchQuery = '';

    constructor() {}

    setActiveTab(tab: 'upcoming' | 'completed'): void {
        this.activeTab = tab;
    }

    onSearch(): void {
        // Search functionality will be implemented later
        console.log('Searching for:', this.searchQuery);
    }
}
