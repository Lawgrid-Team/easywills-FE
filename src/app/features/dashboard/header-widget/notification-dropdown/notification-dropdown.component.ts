import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
    id: number;
    type: 'reminder' | 'plan' | 'pending';
    title: string;
    message: string;
    time: string;
    icon: string;
    action?: {
        text: string;
        link: string;
    };
}

@Component({
    selector: 'app-notification-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-dropdown.component.html',
    styleUrls: ['./notification-dropdown.component.scss'],
})
export class NotificationDropdownComponent {
    notifications: Notification[] = [
        {
            id: 1,
            type: 'reminder',
            title: 'Reminder',
            message: 'Your will is incomplete. Add beneficiaries to proceed.',
            time: '2 minutes',
            icon: '/svg/bell-icon.svg',
        },
        {
            id: 2,
            type: 'plan',
            title: 'Plan',
            message: 'Enjoy more benefits by upgrading your subscription',
            time: '2 minutes',
            icon: '/svg/plan-icon.svg',
            action: {
                text: 'Upgrade plan',
                link: '#',
            },
        },
        {
            id: 3,
            type: 'pending',
            title: 'Pending confirmation',
            message: 'Executor confirmation pending.',
            time: '10 minutes',
            icon: '/svg/pending-icon.svg',
        },
    ];

    markAllAsRead(event: MouseEvent) {
        event.preventDefault();
        console.log('Mark all as read clicked');
        // Add logic to mark all notifications as read
    }
}
