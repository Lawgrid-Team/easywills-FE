import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface InfoDialogData {
    title: string;
    content: string;
    imagePath?: string;
}

@Component({
    selector: 'app-info-dialog',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './info-dialog.component.html',
    styleUrl: './info-dialog.component.scss',
})
export class InfoDialogComponent {
    @Input() pages!: InfoDialogData[];
    @Input() isVisible: boolean = false;
    @Output() close = new EventEmitter<void>();

    currentPageIndex: number = 0;

    constructor() {}

    get data(): InfoDialogData {
        return (
            this.pages?.[this.currentPageIndex] || { title: '', content: '' }
        );
    }

    get hasMultiplePages(): boolean {
        return this.pages && this.pages.length > 1;
    }

    get canGoNext(): boolean {
        return this.currentPageIndex < (this.pages?.length || 0) - 1;
    }

    get canGoPrevious(): boolean {
        return this.currentPageIndex > 0;
    }

    nextPage(): void {
        if (this.canGoNext) {
            this.currentPageIndex++;
        }
    }

    previousPage(): void {
        if (this.canGoPrevious) {
            this.currentPageIndex--;
        }
    }

    closeDialog(): void {
        this.currentPageIndex = 0; // Reset to first page when closing
        this.close.emit();
    }
}
