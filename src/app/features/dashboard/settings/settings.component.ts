import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Router,
} from '@angular/router';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    navItems = [
        { label: 'Profile', link: 'profile' },
        { label: 'Password', link: 'password' },
        { label: 'Subscription', link: 'subscription' },
    ];

    constructor(private router: Router) {}

    isActiveLink(link: string): boolean {
        const currentUrl = this.router.url;
        if (link === 'subscription') {
            return currentUrl.includes('/settings/subscription');
        }
        return currentUrl.endsWith(`/settings/${link}`);
    }
}
