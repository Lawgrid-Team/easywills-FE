import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatDialogModule,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface HelpDialogData {
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
}

@Component({
    selector: 'app-help-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
    ],
    template: `
        <div class="help-dialog">
            <div class="dialog-header flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800">FAQs</h2>
                <button
                    mat-icon-button
                    (click)="closeDialog()"
                    class="text-gray-500 hover:text-gray-700"
                >
                    <mat-icon>close</mat-icon>
                </button>
            </div>

            <div class="dialog-content">
                <mat-accordion class="faq-accordion">
                    <mat-expansion-panel
                        *ngFor="let faq of faqs; let i = index"
                        class="faq-panel mb-3"
                        [expanded]="false"
                    >
                        <mat-expansion-panel-header class="faq-header">
                            <mat-panel-title class="text-gray-700 font-medium">
                                {{ faq.question }}
                            </mat-panel-title>
                        </mat-expansion-panel-header>
                        <div class="faq-content text-gray-600 leading-relaxed">
                            {{ faq.answer }}
                        </div>
                    </mat-expansion-panel>
                </mat-accordion>
            </div>
        </div>
    `,
    styles: [
        `
            .help-dialog {
                min-width: 400px;
                max-width: 600px;
                padding: 24px;
                background: white;
                border-radius: 8px;
            }

            .dialog-header h2 {
                margin: 0;
            }

            .faq-accordion {
                box-shadow: none;
            }

            .faq-panel {
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                box-shadow: none;
            }

            .faq-panel:not(:last-child) {
                margin-bottom: 12px;
            }

            .faq-header {
                padding: 16px 20px;
            }

            .faq-content {
                padding: 0 20px 16px 20px;
                line-height: 1.6;
            }

            ::ng-deep .mat-expansion-panel-header {
                height: auto !important;
                min-height: 48px;
            }

            ::ng-deep .mat-expansion-panel-header-title {
                font-weight: 500;
            }

            ::ng-deep .mat-expansion-panel-body {
                padding: 0;
            }
        `,
    ],
})
export class HelpDialogComponent {
    faqs: Array<{ question: string; answer: string }>;

    constructor(
        private dialogRef: MatDialogRef<HelpDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: HelpDialogData
    ) {
        this.faqs = data?.faqs || this.getDefaultFaqs();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    private getDefaultFaqs(): Array<{ question: string; answer: string }> {
        return [
            {
                question: 'How do I fill out this form correctly?',
                answer: 'Please ensure all required fields are completed with accurate information. Use the validation messages as guidance to correct any errors. If you need to make changes, you can always return to previous steps.',
            },
            {
                question: 'What if I make a mistake in my entries?',
                answer: "Don't worry! You can easily go back to any previous step to make corrections. All your progress is automatically saved, so you won't lose any information. Simply use the navigation to return to the section you need to update.",
            },
        ];
    }
}
