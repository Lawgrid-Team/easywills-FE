import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header-widget.component.html',
    styleUrls: ['./header-widget.component.scss'],
})
export class HeaderWidgetComponent {
    @Input() userName = 'User';
    @Input() userEmail = 'user@example.com';
    @Input() userAvatarUrl?: string;
    @Input() isWillCompleted!: boolean;

    // This property will determine which bell icon to show
    @Input() hasUnreadNotifications = true; // Default to true for unread icon

    // Removed notificationBadgeVisible and notificationCount as they are no longer needed for the red dot
}
