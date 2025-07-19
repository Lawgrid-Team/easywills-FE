import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header-widget.component.html',
    styleUrls: ['./header-widget.component.scss'],
})
export class HeaderWidgetComponent {
    @Input() title = '';
    @Input() subtitle = '';
    @Input() userName = 'User';
    @Input() userEmail = 'user@example.com';
    @Input() userAvatarUrl?: string;
    @Input() isWillCompleted!: boolean;
    @Input() hasUnreadNotifications = true;
    @Input() showGoBackButton = false;

    @Output() goBack = new EventEmitter<void>();
}
