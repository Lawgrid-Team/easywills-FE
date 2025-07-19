import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Activity {
    date: string;
    time: string;
    description: string;
    // icon property is no longer needed if we hardcode the emoji
}

@Component({
    selector: 'app-recent-activity-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recent-activity-widget.component.html',
    styleUrls: ['./recent-activity-widget.component.scss'],
})
export class RecentActivityWidgetComponent {
    @Input() activities: Activity[] = [];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
