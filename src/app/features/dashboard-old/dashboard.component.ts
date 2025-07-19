import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderWidgetComponent } from './header-widget/header-widget.component';
import { YourWillWidgetComponent } from './your-will-widget/your-will-widget.component';
import { QuickActionsWidgetComponent } from './quick-actions-widget/quick-actions-widget.component';
import {
    RecentActivityWidgetComponent,
    type Activity,
} from './recent-activity-widget/recent-activity-widget.component';
// Ensure this path is correct and the component is created
import { CreateCodicilsWidgetComponent } from './create-codicils-widget/create-codicils-widget.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        SidebarComponent,
        HeaderWidgetComponent,
        YourWillWidgetComponent,
        QuickActionsWidgetComponent,
        RecentActivityWidgetComponent,
        CreateCodicilsWidgetComponent, // Add CreateCodicilsWidgetComponent here
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
    isWillCompleted = false; // Set to true to test "Completed" state
    willStatus: 'inProgress' | 'completed' = 'inProgress';

    recentActivities: Activity[] = [
        {
            date: 'Feb 8, 2025',
            time: '10:15 AM',
            description: 'Added a new beneficiary (John Doe)',
        },
        {
            date: 'Feb 7, 2025',
            time: '4:30 PM',
            description: 'Updated will document details',
        },
        {
            date: 'Feb 6, 2025',
            time: '9:00 AM',
            description: 'Uploaded signed will',
        },
        {
            date: 'Feb 5, 2025',
            time: '2:45 PM',
            description: 'Assigned witnesses to the will',
        },
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    ngOnInit(): void {
        this.willStatus = this.isWillCompleted ? 'completed' : 'inProgress';
        this.currentPlan.type = this.isWillCompleted ? 'Legacy+' : 'Free';
    }
}
