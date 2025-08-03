import { Component, type OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { YourWillWidgetComponent } from './your-will-widget/your-will-widget.component';
import { QuickActionsWidgetComponent } from './quick-actions-widget/quick-actions-widget.component';
import {
    RecentActivityWidgetComponent,
    type Activity,
} from './recent-activity-widget/recent-activity-widget.component';
import { CreateCodicilsWidgetComponent } from './create-codicils-widget/create-codicils-widget.component';
import { WillStateService } from '../../../shared/services/will-state.service';

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
export class MyWillComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    // State managed by WillStateService - initialized by service subscription
    isWillCompleted!: boolean; // Using definite assignment assertion since it's set in ngOnInit
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

    constructor(private willStateService: WillStateService) {}

    ngOnInit(): void {
        // Subscribe to will completion status changes
        this.subscriptions.add(
            this.willStateService.isWillCompleted$.subscribe((completed) => {
                this.isWillCompleted = completed;
                this.willStatus = completed ? 'completed' : 'inProgress';
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
