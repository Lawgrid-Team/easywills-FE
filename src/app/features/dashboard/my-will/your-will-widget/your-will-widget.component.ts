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
    @Input() status: 'inProgress' | 'completed' = 'inProgress';
    @Input() lastUpdated = 'N/A';

    constructor(private router: Router) {}

    get buttonText(): string {
        return this.status === 'inProgress'
            ? 'Continue editing my will'
            : 'View my will';
    }

    onContinueWill(): void {
        if (this.status === 'inProgress') {
            // Navigate to wizard welcome with continue parameter
            this.router.navigate(['/wiz/welcome'], {
                queryParams: { continue: 'true' },
            });
        } else {
            // Navigate to completed will view
            this.router.navigate(['/view-will']);
        }
    }
}
