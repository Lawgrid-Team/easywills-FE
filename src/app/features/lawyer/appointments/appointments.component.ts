import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface Appointment {
    id: number;
    clientName: string;
    address: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed';
    profilePicture?: string; // Optional profile picture URL
}

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
export class AppointmentsComponent implements OnInit {
    activeTab: 'upcoming' | 'completed' = 'upcoming';
    searchQuery = '';

    // Sample appointments data
    appointments: Appointment[] = [
        {
            id: 1,
            clientName: 'John Smith',
            address: '123 Main St, New York, NY',
            date: 'Jan 15, 2026',
            time: '10:00 AM',
            status: 'upcoming',
        },
        {
            id: 2,
            clientName: 'Sarah Johnson',
            address: '456 Park Ave, Brooklyn, NY',
            date: 'Jan 16, 2026',
            time: '2:30 PM',
            status: 'upcoming',
        },
        {
            id: 3,
            clientName: 'Michael Brown',
            address: '789 Broadway, Manhattan, NY',
            date: 'Jan 18, 2026',
            time: '11:00 AM',
            status: 'upcoming',
        },
        {
            id: 4,
            clientName: 'Emily Davis',
            address: '321 5th Ave, Queens, NY',
            date: 'Dec 20, 2025',
            time: '3:00 PM',
            status: 'completed',
        },
        {
            id: 5,
            clientName: 'David Wilson',
            address: '654 Madison Ave, Bronx, NY',
            date: 'Dec 18, 2025',
            time: '1:00 PM',
            status: 'completed',
        },
    ];

    nextAppointment: Appointment | null = null;
    upcomingCount = 0;
    completedCount = 0;

    constructor() {}

    ngOnInit(): void {
        this.calculateCounts();
        this.setNextAppointment();
    }

    setActiveTab(tab: 'upcoming' | 'completed'): void {
        this.activeTab = tab;
    }

    onSearch(): void {
        // Search functionality will be implemented later
        console.log('Searching for:', this.searchQuery);
    }

    getFilteredAppointments(): Appointment[] {
        let filtered = this.appointments.filter(
            (apt) => apt.status === this.activeTab
        );

        // Apply search filter if query exists
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (apt) =>
                    apt.clientName.toLowerCase().includes(query) ||
                    apt.address.toLowerCase().includes(query)
            );
        }

        return filtered;
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2); // Take only first 2 initials
    }

    private calculateCounts(): void {
        this.upcomingCount = this.appointments.filter(
            (apt) => apt.status === 'upcoming'
        ).length;
        this.completedCount = this.appointments.filter(
            (apt) => apt.status === 'completed'
        ).length;
    }

    private setNextAppointment(): void {
        const upcoming = this.appointments
            .filter((apt) => apt.status === 'upcoming')
            .sort((a, b) => {
                // Simple sorting by date string (works for this format)
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

        this.nextAppointment = upcoming.length > 0 ? upcoming[0] : null;
    }
}
