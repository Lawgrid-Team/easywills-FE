import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Activity {
    type: string;
    title: string;
    details: string;
    pdfName?: string;
    user: string;
    action: string;
    actionLink: string;
}

@Component({
    selector: 'app-activity-log',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './activity-log.component.html',
    styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent {
    activities: Activity[] = [
        {
            type: 'Upload Document',
            title: 'Uploaded new Will & Testament',
            details: 'Reviewed by legal team',
            user: 'Attorney',
            action: 'View',
            actionLink: '#',
        },
        {
            type: 'Share Document',
            title: 'Shared Trust Document with family',
            details: 'Email sent to John Smith',
            user: 'Son',
            action: 'Download',
            actionLink: '#',
        },
        {
            type: 'Upload Document',
            title: 'Estate Planning.pdf',
            details: '',
            user: 'Attorney',
            action: 'View',
            actionLink: '#',
        },
        {
            type: 'Edit Document',
            title: 'Modified Power of Attorney',
            details: 'Updated contact information',
            user: 'Attorney',
            action: 'View Changes',
            actionLink: '#',
        },
        {
            type: 'Share Document',
            title: 'Shared Trust Document with family',
            details: 'Email sent to John Smith',
            user: 'Brother',
            action: 'Download',
            actionLink: '#',
        },
    ];
}
