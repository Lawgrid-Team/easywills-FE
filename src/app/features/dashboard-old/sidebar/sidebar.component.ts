import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
// Removed all lucide-angular imports

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    navItems = [
        {
            label: 'My Will',
            icon: '/svg/my-will.svg', 
            link: '/dashboard/my-will',
            active: true,
        },
        {
            label: 'My Documents',
            icon: '/svg/my-documents.svg', 
            link: '/dashboard/documents',
            active: false,
        },
        {
            label: 'Digital Vault',
            icon: '/svg/digital-vault.svg', 
            link: '/dashboard/vault',
            active: false,
        },
    ];

    utilityItems = [
        {
            label: 'Settings',
            icon: '/svg/settings.svg', 
            link: '/dashboard/settings',
        },
        {
            label: 'Help and support',
            icon: '/svg/help-and-support.svg', 
            link: '/dashboard/help',
        },
        {
            label: 'Logout',
            icon: '/svg/logout.svg', 
            link: '/logout',
        },
    ];
}
