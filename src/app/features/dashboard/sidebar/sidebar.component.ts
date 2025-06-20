import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

// Importing Lucide icons
import {
    FileText,
    Folder,
    Lock,
    Settings,
    HelpCircle,
    LogOut,
    LucideAngularModule,
} from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    // Making icons available in the template
    icons = { FileText, Folder, Lock, Settings, HelpCircle, LogOut };

    navItems = [
        {
            label: 'My Will',
            icon: 'FileText',
            link: '/dashboard/my-will',
            active: true,
        }, // Assuming '/dashboard/my-will' or similar
        {
            label: 'My Documents',
            icon: 'Folder',
            link: '/dashboard/documents',
            active: false,
        },
        {
            label: 'Digital Vault',
            icon: 'Lock',
            link: '/dashboard/vault',
            active: false,
        },
    ];

    utilityItems = [
        { label: 'Settings', icon: 'Settings', link: '/dashboard/settings' },
        {
            label: 'Help and support',
            icon: 'HelpCircle',
            link: '/dashboard/help',
        },
        { label: 'Logout', icon: 'LogOut', link: '/logout' }, // Or a method to handle logout
    ];

    // TODO: Implement actual active state logic based on routing
    // For now, 'My Will' is hardcoded as active for visual representation
}
