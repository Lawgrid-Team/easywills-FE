import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

export interface HelpFAQ {
    question: string;
    answer: string;
}

@Component({
    selector: 'app-wizard-help-box',
    standalone: true,
    imports: [CommonModule, MatExpansionModule, MatIconModule],
    template: `
        <!-- Help Box - positioned independently to not affect button layout -->
        <div
            *ngIf="showHelpBox"
            class="fixed bottom-40 right-8 z-50 w-72 bg-white rounded-lg border border-gray-200 overflow-hidden transform transition-all duration-300 ease-out"
            style="animation: slideUp 0.3s ease-out"
        >
            <!-- Help Box Header -->
            <div class="px-4 py-3 border-b border-gray-200 text-center">
                <h3 class="text-base font-medium text-gray-800">FAQs</h3>
            </div>

            <!-- Help Box Content -->
            <div class="pt-1 px-4 pb-4 max-h-80 overflow-y-auto">
                <mat-accordion class="help-accordion">
                    <mat-expansion-panel
                        *ngFor="let faq of faqs"
                        class="help-panel"
                        [class.mb-3]="!isLast(faq)"
                    >
                        <mat-expansion-panel-header>
                            <mat-panel-title
                                class="text-xs font-medium text-gray-700"
                            >
                                {{ faq.question }}
                            </mat-panel-title>
                        </mat-expansion-panel-header>
                        <div
                            class="text-xs text-gray-600 leading-relaxed pt-1 answer-content"
                        >
                            {{ faq.answer }}
                        </div>
                    </mat-expansion-panel>
                </mat-accordion>

                <!-- Talk to someone section -->
                <div
                    class="border-t border-gray-200 pt-3 mt-3 flex justify-center"
                >
                    <button
                        type="button"
                        class="w-4/5 mx-auto block bg-[#444444] text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                    >
                        Talk to someone
                    </button>
                </div>
            </div>
        </div>

        <!-- Help Button Container - separate and fixed position -->
        <div class="fixed bottom-24 right-8 z-50">
            <button
                type="button"
                (click)="toggleHelpBox()"
                class="flex items-center border border-foreground rounded-md px-4 py-2 bg-[#efefef] ring-1 ring-easywills-black hover:bg-gray-200 transition-all duration-200 cursor-pointer"
            >
                <span class="mr-2">Need help?</span>
                <mat-icon>question_answer</mat-icon>
            </button>
        </div>
    `,
    styleUrls: ['./wizard-help-box.component.scss'],
})
export class WizardHelpBoxComponent {
    @Input() faqs: HelpFAQ[] = [];

    showHelpBox = false;

    toggleHelpBox(): void {
        this.showHelpBox = !this.showHelpBox;
    }

    closeHelpBox(): void {
        this.showHelpBox = false;
    }

    isLast(faq: HelpFAQ): boolean {
        return this.faqs.indexOf(faq) === this.faqs.length - 1;
    }
}
