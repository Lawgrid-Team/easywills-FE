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
    @Input() userAvatarUrl?: string; // Will be set to /svg/display-pic.svg from parent
    @Input() isWillCompleted!: boolean;
    @Input() hasUnreadNotifications = true;
}
