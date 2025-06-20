import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header-widget.component.html',
    styleUrl: './header-widget.component.scss',
})
export class HeaderWidgetComponent {
    @Input() userName = 'User';
    @Input() userEmail = 'user@example.com';
    @Input() userAvatarUrl?: string;
    @Input() isWillCompleted = false;

    // Placeholder for notification count
    notificationCount = 1;
}
