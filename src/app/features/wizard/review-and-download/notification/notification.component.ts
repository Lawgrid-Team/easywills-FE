import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    animations: [
        trigger('toastAnimation', [
            state(
                'void',
                style({ transform: 'translateY(-100%)', opacity: 0 })
            ),
            state('*', style({ transform: 'translateY(0)', opacity: 1 })),
            transition('void => *', [animate('300ms ease-out')]),
            transition('* => void', [animate('300ms ease-in')]),
        ]),
    ],
})
export class NotificationComponent {
    @Input() message = 'Your watermarked Will file has been downloaded';
    @Input() title = 'Download successful';
    @Input() type: 'success' | 'error' = 'success';
    @Output() closeNotification = new EventEmitter<void>();

    onClose() {
        this.closeNotification.emit();
    }
}
