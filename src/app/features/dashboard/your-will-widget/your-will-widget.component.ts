import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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

    get buttonText(): string {
        return this.status === 'inProgress'
            ? 'Continue editing my will'
            : 'View my will';
    }
}
