import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/utils/notification.service';

@Component({
    selector: 'app-lawyer-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './lawyer-sidebar.component.html',
    styleUrls: ['./lawyer-sidebar.component.scss'],
})
export class LawyerSidebarComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private notification = inject(NotificationService);

    navItems = [
        {
            label: 'Appointments',
            icon: '/svg/lawyer-appoiontments.svg',
            link: '/lawyer/dashboard/appointments',
        },
        {
            label: 'Profile',
            icon: '/svg/settings.svg',
            link: '/lawyer/dashboard/profile',
        },
    ];

    utilityItems = [
        {
            label: 'Help and support',
            icon: '/svg/help-and-support.svg',
            link: '/lawyer/dashboard/help',
        },
        {
            label: 'Logout',
            icon: '/svg/logout.svg',
            link: null,
            action: () => this.logout(),
        },
    ];

    logout() {
        // Call the logout method which handles the API call and redirect
        this.authService.logout();
        // Override the default redirect to go to lawyer login instead
        setTimeout(() => {
            this.router.navigate(['/lawyer/login'], { replaceUrl: true });
        }, 100);
    }
}
