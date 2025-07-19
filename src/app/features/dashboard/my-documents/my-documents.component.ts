import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationHubWidgetComponent } from './organization-hub-widget/organization-hub-widget.component';
import { DocumentsListWidgetComponent, type Document } from './documents-list-widget/documents-list-widget.component';

@Component({
    selector: 'app-my-documents',
    standalone: true,
    imports: [
        CommonModule,
        OrganizationHubWidgetComponent,
        DocumentsListWidgetComponent,
    ],
    templateUrl: './my-documents.component.html',
    styleUrls: ['./my-documents.component.scss'],
})
export class MyDocumentsComponent {
    documents: Document[] = [
        {
            id: 1,
            date: 'Feb 8, 2025',
            time: '10:15 AM',
            name: 'Bank Accounts.pdf',
            type: 'pdf',
        },
        {
            id: 2,
            date: 'Feb 7, 2025',
            time: '4:30 PM',
            name: 'Power of Attorney.pdf',
            type: 'pdf',
        },
        {
            id: 3,
            date: 'Feb 6, 2025',
            time: '9:00 AM',
            name: 'Estate Planning.pdf',
            type: 'pdf',
        },
        {
            id: 4,
            date: 'Feb 5, 2025',
            time: '2:45 PM',
            name: 'Bank Accounts.pdf',
            type: 'pdf',
        },
        {
            id: 5,
            date: 'Feb 3, 2025',
            time: '6:20 PM',
            name: 'Car properties.doc',
            type: 'doc',
        },
    ];
}
