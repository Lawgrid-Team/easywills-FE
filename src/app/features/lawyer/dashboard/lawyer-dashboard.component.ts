import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LawyerSidebarComponent } from '../sidebar/lawyer-sidebar.component';
import { HeaderWidgetComponent } from '../../dashboard/header-widget/header-widget.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from '../../../core/services/Wizard/account.service';

@Component({
    selector: 'app-lawyer-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        LawyerSidebarComponent,
        HeaderWidgetComponent,
    ],
    templateUrl: './lawyer-dashboard.component.html',
    styleUrls: ['./lawyer-dashboard.component.scss'],
})
export class LawyerDashboardComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    // User data
    userName = 'Lawyer Name';
    userEmail = 'lawyer@example.com';
    userAvatarUrl = '/svg/display-pic.svg';
    hasUnreadNotifications = true;

    // Dynamic header data
    headerTitle = '';
    headerSubtitle = '';
    hideHeader = false;

    constructor(
        private router: Router,
        private accountService: AccountService
    ) {}

    ngOnInit(): void {
        // Get user profile data
        this.accountService.getUserProfile();

        this.subscriptions.add(
            this.accountService.userData$.subscribe({
                next: (value) => {
                    if (value) {
                        this.userName = value.name;
                        this.userEmail = value.email;
                        if (value.avatar) {
                            this.userAvatarUrl = value.avatar;
                        }
                    }
                },
            })
        );

        // Listen to route changes to update header
        this.subscriptions.add(
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.updateHeader();
                })
        );

        this.updateHeader();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private updateHeader(): void {
        const url = this.router.url;

        if (url.includes('/lawyer/dashboard/appointments')) {
            this.headerTitle = 'Appointments';
            this.headerSubtitle = '';
            this.hideHeader = false;
        } else if (url.includes('/lawyer/dashboard/profile')) {
            this.headerTitle = 'Profile';
            this.headerSubtitle = '';
            this.hideHeader = false;
        } else {
            // Default
            this.headerTitle = 'Appointments';
            this.headerSubtitle = '';
            this.hideHeader = false;
        }
    }
}
