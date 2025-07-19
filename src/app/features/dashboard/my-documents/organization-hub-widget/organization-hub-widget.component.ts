import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-organization-hub-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './organization-hub-widget.component.html',
    styleUrls: ['./organization-hub-widget.component.scss'],
})
export class OrganizationHubWidgetComponent {
    onUploadDocument(): void {
        // TODO: Implement document upload functionality
        console.log('Upload document clicked');
    }
}
