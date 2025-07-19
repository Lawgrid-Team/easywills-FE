import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderWidgetComponent } from './header-widget/header-widget.component';

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
export class DashboardComponent implements OnInit {
    currentUser = {
        name: 'John',
        email: 'johndoe@gmail.com',
        avatar: '/svg/display-pic.svg',
    };
    currentPlan = {
        type: 'Free', // or 'Legacy+'
    };
    isWillCompleted = false; // Set to true to test "Completed" state - CHANGE THIS TO SEE TOGGLE (should match my-will.component.ts)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    ngOnInit(): void {
        this.currentPlan.type = this.isWillCompleted ? 'Legacy+' : 'Free';
    }
}
