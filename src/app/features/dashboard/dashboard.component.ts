import {AccountService} from './../../core/services/Wizard/account.service';
import {Component, type OnDestroy, type OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet,} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HeaderWidgetComponent} from './header-widget/header-widget.component';
import {WillStateService} from '../../shared/services/will-state.service';
import {MyDocumentsComponent} from './my-documents/my-documents.component';

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
    isWillCompleted!: boolean;
    hasUnreadNotifications = true;

    // Dynamic header data
    headerTitle = '';
    headerSubtitle = '';
    isUploadingInChild = false;
    isViewingAllInChild = false;
    hideHeader = false;
    showUpgradePlan = true;
    showUpgradeButton = true;
    badgeText = '';
    plan = 'Free'

    constructor(
        private willStateService: WillStateService,
        private accountService: AccountService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {

        this.willStateService.getWillState();
        this.accountService.getUserProfile();

        this.subscriptions.add(
            this.willStateService.willState$.subscribe({
                next: (value) => {
                    if (value) {
                        this.plan = value.account.planText
                        this.isWillCompleted = value.status === 'completed' ? true : false;
                    }
                }
            })
        );

        this.subscriptions.add(
            this.accountService.userData$.subscribe({
                next: (value) => {
                    if (value) {
                        this.userName = value.name;
                        this.userEmail = value.email;
                        if (value.avatar) {
                            this.userAvatarUrl = value.avatar
                        }
                    }
                }
            })
        );

        // this.willStateService.willState$
        //     .subscribe({
        //         next: (value: any) => {
        //             this.badgeText = value.account.planText;
        //             if (this.badgeText === '') {
        //                 this.showUpgradePlan = false
        //             }
        //         },
        //     })


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
            this.hideHeader = false;
            this.showUpgradePlan = true;
            this.showUpgradeButton = true;
            this.badgeText = '';
        } else if (this.isUploadingInChild && url.includes('/my-documents')) {
            this.headerTitle = 'Upload document';
            this.headerSubtitle = '';
            this.hideHeader = false;
            this.showUpgradePlan = true;
            this.showUpgradeButton = true;
            this.badgeText = '';
        } else if (url.includes('/my-will')) {
            this.headerTitle = `Welcome back, ${this.userName!}`;
            this.headerSubtitle =
                "Here's an overview of your Will planning progress.";
            this.hideHeader = false;
            this.showUpgradePlan = true;
            this.showUpgradeButton = true;
            this.badgeText = '';
        } else if (url.includes('/my-documents')) {
            this.headerTitle = 'Documents';
            this.headerSubtitle = 'Manage your Will documents and legal files';
            this.hideHeader = false;
            this.showUpgradePlan = true;
            this.showUpgradeButton = true;
            this.badgeText = '';
        } else if (url.includes('/digital-vault')) {
            this.headerTitle = 'Digital Vault';
            this.headerSubtitle = 'Track and manage all action of your Will';
            this.hideHeader = false;
            this.showUpgradePlan = true;
            this.showUpgradeButton = false;
            this.badgeText = 'Upload';
        } else if (url.includes('/settings')) {
            this.headerTitle = 'Settings';
            this.headerSubtitle = 'Manage your account and preferences';
            this.hideHeader = true;
            this.showUpgradePlan = true;
            this.showUpgradeButton = true;
            this.badgeText = '';
        } else {
            // Default for /dashboard root
            this.headerTitle = `Welcome back, ${this.userName!}`;
            this.headerSubtitle =
                "Here's an overview of your Will planning progress.";
            this.hideHeader = false;
            this.showUpgradePlan = true;
            this.showUpgradeButton = true;
            this.badgeText = '';
        }
    }
}
