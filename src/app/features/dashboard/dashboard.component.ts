import { Component, type OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderWidgetComponent } from './header-widget/header-widget.component';
import { WillStateService } from '../../shared/services/will-state.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule, // Add RouterModule for <router-outlet>
        SidebarComponent,
        HeaderWidgetComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    currentUser = {
        name: 'John',
        email: 'johndoe@gmail.com',
        avatar: '/svg/display-pic.svg',
    };
    currentPlan = {
        type: 'Free', // or 'Legacy+'
    };
    isWillCompleted!: boolean; // This will be updated from the service subscription

    constructor(private willStateService: WillStateService) {}

    ngOnInit(): void {
        // Subscribe to will completion status changes
        this.subscriptions.add(
            this.willStateService.isWillCompleted$.subscribe((completed) => {
                this.isWillCompleted = completed;
            })
        );

        // Subscribe to plan changes
        this.subscriptions.add(
            this.willStateService.currentPlan$.subscribe((plan) => {
                this.currentPlan.type = plan;
            })
        );

        // Set initial state for testing - CHANGE THIS TO TOGGLE STATE
        this.willStateService.setWillCompleted(false);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
