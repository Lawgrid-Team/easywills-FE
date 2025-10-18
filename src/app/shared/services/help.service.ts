import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    HelpDialogComponent,
    HelpDialogData,
} from '../components/help-dialog/help-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class HelpService {
    constructor(private dialog: MatDialog) {}

    openHelpDialog(data?: HelpDialogData): void {
        this.dialog.open(HelpDialogComponent, {
            data: data || {},
            width: '500px',
            maxWidth: '90vw',
            panelClass: 'help-dialog-panel',
            backdropClass: 'help-dialog-backdrop',
            autoFocus: false,
            restoreFocus: false,
        });
    }

    openFormHelpDialog(formType?: string): void {
        const formSpecificFaqs = this.getFormSpecificFaqs(formType);
        this.openHelpDialog({ faqs: formSpecificFaqs });
    }

    private getFormSpecificFaqs(
        formType?: string
    ): Array<{ question: string; answer: string }> {
        switch (formType) {
            case 'personal-details':
                return [
                    {
                        question: 'What personal information is required?',
                        answer: 'We need your full legal name, date of birth, current address, and contact information. This ensures your will is legally valid and we can reach you if needed.',
                    },
                    {
                        question: 'Is my personal information secure?',
                        answer: 'Yes, all your personal information is encrypted and stored securely. We follow industry-standard security practices to protect your data and privacy.',
                    },
                ];
            case 'assets':
                return [
                    {
                        question: 'What types of assets should I include?',
                        answer: 'Include all significant assets such as real estate, vehicles, bank accounts, investments, jewelry, and valuable personal items. This ensures comprehensive estate planning.',
                    },
                    {
                        question:
                            'How detailed should my asset descriptions be?',
                        answer: 'Provide enough detail to uniquely identify each asset. For real estate, include the full address. For accounts, include the institution name and account type.',
                    },
                ];
            case 'beneficiaries':
                return [
                    {
                        question: 'Who can be a beneficiary?',
                        answer: 'Beneficiaries can be family members, friends, organizations, or charities. You can specify individuals by their full legal names and relationship to you.',
                    },
                    {
                        question: 'Can I change beneficiaries later?',
                        answer: 'Yes, you can update your will at any time to add, remove, or modify beneficiaries. We recommend reviewing your beneficiaries periodically to ensure they reflect your current wishes.',
                    },
                ];
            default:
                return [
                    {
                        question: 'How do I fill out this form correctly?',
                        answer: 'Please ensure all required fields are completed with accurate information. Use the validation messages as guidance to correct any errors. If you need to make changes, you can always return to previous steps.',
                    },
                    {
                        question: 'What if I make a mistake in my entries?',
                        answer: "Don't worry! You can easily go back to any previous step to make corrections. All your progress is automatically saved, so you won't lose any information.",
                    },
                ];
        }
    }
}
