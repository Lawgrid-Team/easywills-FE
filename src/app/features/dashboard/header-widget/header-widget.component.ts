import {Component, ElementRef, EventEmitter, HostListener, Input, Output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationDropdownComponent} from './notification-dropdown/notification-dropdown.component';
import {WillStateService} from '../../../shared/services/will-state.service';

@Component({
    selector: 'app-header-widget',
    standalone: true,
    imports: [CommonModule, NotificationDropdownComponent],
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
    @Input() showUpgradePlan = true;
    @Input() showUpgradeButton = true;
    @Input() badgeText = ''; // New property to control badge text

    @Output() goBack = new EventEmitter<void>();

    showNotifications = false;

    constructor(private elementRef: ElementRef,
                private willStateService: WillStateService) {
    }

    ngOnInit(): void {
        this.willStateService.getWillStatusFromBE()
            .subscribe({
                next: (value: any) => {
                    // this.showUpgradeButton = value.account.plan === "FREE";
                    this.badgeText = value.account.planText;
                    if (this.badgeText === '') {
                        this.showUpgradePlan = false
                    }
                },
            })
    }

    toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showNotifications = false;
        }
    }
}
