import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-your-will-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './your-will-widget.component.html',
    styleUrls: ['./your-will-widget.component.scss'],
})
export class YourWillWidgetComponent {
    @Input() status: 'notStarted' | 'inProgress' | 'completed' | 'scheduled' =
        'notStarted';
    @Input() lastUpdated = 'N/A';

    constructor(private router: Router) {}

    get buttonText(): string {
        switch (this.status) {
            case 'notStarted':
                return 'Create my will';
            case 'completed':
                return 'View my will';
            case 'scheduled':
                return 'Reschedule Signing';
            case 'inProgress':
            default:
                return 'Continue editing my will';
        }
    }

    onContinueWill(): void {
        if (this.status === 'completed') {
            // Navigate to completed will view
            this.router.navigate(['/view-will']);
        } else if (this.status === 'scheduled') {
            this.router.navigate(['/wiz/will/schedule'], {
                queryParams: { continue: 'true' },
            });
        } else if (this.status === 'notStarted') {
            // Start a new will
            this.router.navigate(['/wiz/welcome']);
        } else {
            // Continue editing existing will
            this.router.navigate(['/wiz/welcome'], {
                queryParams: { continue: 'true' },
            });
        }
    }
}
