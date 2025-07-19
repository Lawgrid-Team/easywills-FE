import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YourWillWidgetComponent } from './your-will-widget/your-will-widget.component';
import { QuickActionsWidgetComponent } from './quick-actions-widget/quick-actions-widget.component';
import {
    RecentActivityWidgetComponent,
    type Activity,
} from './recent-activity-widget/recent-activity-widget.component';
import { CreateCodicilsWidgetComponent } from './create-codicils-widget/create-codicils-widget.component';

@Component({
    selector: 'app-my-will',
    standalone: true,
    imports: [
        CommonModule,
        YourWillWidgetComponent,
        QuickActionsWidgetComponent,
        RecentActivityWidgetComponent,
        CreateCodicilsWidgetComponent,
    ],
    templateUrl: './my-will.component.html',
    styleUrls: ['./my-will.component.scss'],
})
export class MyWillComponent implements OnInit {
    // This component now manages the state for the "My Will" page
    isWillCompleted = true; // Set to true to test "Completed" state - CHANGE THIS TO SEE TOGGLE
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
    }
}
