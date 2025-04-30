import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [MatButtonModule, MatIconModule, RouterModule, CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    @Input() step = 0;
    @Input() isNextDisabled = false;
    @Output() back = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    onBack(): void {
        this.back.emit();
    }

    onNext(): void {
        this.next.emit();
    }
    onFinish(): void {
        this.next.emit();
    }
    onSkip(): void {
        this.next.emit();
    }
}
