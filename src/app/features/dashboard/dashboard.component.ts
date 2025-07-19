import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderWidgetComponent } from './header-widget/header-widget.component';
import { WillStateService } from '../../shared/services/will-state.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        HeaderWidgetComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    // User and will data
    userName = 'John Doe';
    userEmail = 'johndoe@gmail.com';
    userAvatarUrl = '/svg/display-pic.svg';
    isWillCompleted = true;
    hasUnreadNotifications = true;

    // Dynamic header data
    headerTitle = '';
    headerSubtitle = '';

    constructor(
        private willStateService: WillStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Subscribe to will completion status
        this.subscriptions.add(
            this.willStateService.isWillCompleted$.subscribe((completed) => {
                this.isWillCompleted = completed;
            })
        );

        // Subscribe to router events to update header
        this.subscriptions.add(
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe((event: NavigationEnd) => {
                    this.updateHeaderFromUrl(event.url);
                })
        );

        // Set initial header data
        this.updateHeaderFromUrl(this.router.url);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private updateHeaderFromUrl(url: string): void {
        if (url.includes('/my-will')) {
            this.headerTitle = 'Welcome back, John Doe!';
            this.headerSubtitle =
                "Here's an overview of your Will planning progress.";
        } else if (url.includes('/my-documents')) {
            this.headerTitle = 'Documents';
            this.headerSubtitle = 'Manage your Will documents and legal files';
        } else {
            // Default for /dashboard root
            this.headerTitle = 'Welcome back, John Doe!';
            this.headerSubtitle =
                "Here's an overview of your Will planning progress.";
        }
    }
}
