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
import { MyDocumentsComponent } from './my-documents/my-documents.component';

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
    private childComponent: any;
    private childSub: Subscription | undefined;

    // User and will data
    userName = 'John Doe';
    userEmail = 'johndoe@gmail.com';
    userAvatarUrl = '/svg/display-pic.svg';
    isWillCompleted = false;
    hasUnreadNotifications = true;

    // Dynamic header data
    headerTitle = '';
    headerSubtitle = '';
    isUploadingInChild = false;
    isViewingAllInChild = false;

    constructor(
        private willStateService: WillStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.willStateService.isWillCompleted$.subscribe((completed) => {
                this.isWillCompleted = completed;
            })
        );

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
        this.childSub?.unsubscribe();
    }

    onActivate(component: any): void {
        this.childComponent = component;
        if (component instanceof MyDocumentsComponent) {
            this.childSub = component.uploadingStateChange.subscribe(
                (isUploading: boolean) => {
                    this.isUploadingInChild = isUploading;
                    this.updateHeader();
                }
            );

            // Subscribe to viewing all state
            this.childSub.add(
                component.viewingAllStateChange.subscribe(
                    (isViewingAll: boolean) => {
                        this.isViewingAllInChild = isViewingAll;
                        this.updateHeader();
                    }
                )
            );
        }
    }

    onDeactivate(): void {
        this.childComponent = null;
        this.childSub?.unsubscribe();
        this.isUploadingInChild = false;
        this.isViewingAllInChild = false;
    }

    onGoBack(): void {
        if (
            this.childComponent &&
            typeof this.childComponent.onGoBack === 'function'
        ) {
            this.childComponent.onGoBack();
        }
    }

    private updateHeader(): void {
        const url = this.router.url;

        if (this.isViewingAllInChild && url.includes('/my-documents')) {
            this.headerTitle = 'Documents';
            this.headerSubtitle = '';
        } else if (this.isUploadingInChild && url.includes('/my-documents')) {
            this.headerTitle = 'Upload document';
            this.headerSubtitle = '';
        } else if (url.includes('/my-will')) {
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
