import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    selector: 'app-your-will-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './your-will-widget.component.html',
    styleUrls: ['./your-will-widget.component.scss'],
})
export class YourWillWidgetComponent {
    @Input() status: 'inProgress' | 'completed' | 'scheduled' = 'inProgress';
    @Input() lastUpdated = 'N/A';

    constructor(private router: Router) {}

    get buttonText(): string {
        return this.status === 'completed'
            ? 'View my will'
            : this.status === 'scheduled'
                ? 'Reschedule Signing'
                : 'Continue editing my will';
    }

    onContinueWill(): void {
        if (this.status === 'completed') {
            // Navigate to completed will view
            this.router.navigate(['/view-will']);
        } else if (this.status === 'scheduled') {
            this.router.navigate(['/wiz/will/schedule'], {
                queryParams: {continue: 'true'},
            });
        } else {
            this.router.navigate(['/wiz/welcome'], {
                queryParams: { continue: 'true' },
            });
        }
    }
}
