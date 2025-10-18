import { Injectable } from '@angular/core';
import { HelpFAQ } from '../components/wizard-help-box/wizard-help-box.component';

@Injectable({
    providedIn: 'root',
})
export class WizardHelpService {
    getFAQsForForm(formType: string): HelpFAQ[] {
        switch (formType) {
            case 'basic-info':
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

            case 'address-info':
                return [
                    {
                        question: 'Why do you need my address information?',
                        answer: 'Your current address is required for legal documentation and to ensure we can contact you. This information is also necessary for the proper execution of your will.',
                    },
                    {
                        question: 'Can I use a P.O. Box address?',
                        answer: "We recommend using your residential address for legal documents. If you must use a P.O. Box, please ensure it's acceptable in your jurisdiction for legal correspondence.",
                    },
                ];

            case 'marital-status':
                return [
                    {
                        question:
                            'Why is marital status important for my will?',
                        answer: "Your marital status affects inheritance laws and determines your spouse's legal rights to your estate. It's crucial for ensuring your will is legally valid and enforceable.",
                    },
                    {
                        question:
                            'What if my marital status changes after creating my will?',
                        answer: 'You should update your will whenever your marital status changes. Marriage, divorce, or separation can significantly impact the validity and distribution terms of your will.',
                    },
                ];

            case 'birth-info':
                return [
                    {
                        question: 'Why do you need my birth information?',
                        answer: 'Birth date and place help establish your legal identity and ensure your will meets jurisdictional requirements. This information is essential for proper legal documentation.',
                    },
                    {
                        question: 'Is my birth information kept private?',
                        answer: 'Yes, all personal information including birth details are stored securely and only used for creating your legal will document. We follow strict privacy and security protocols.',
                    },
                ];

            case 'children':
                return [
                    {
                        question: 'Do I need to include all my children?',
                        answer: 'Yes, you should list all your children, including adopted children and stepchildren you wish to include in your will. This prevents potential legal challenges and ensures clarity.',
                    },
                    {
                        question:
                            'What if I have children from previous relationships?',
                        answer: 'Include all children you wish to provide for, regardless of the relationship. You can specify different provisions for different children based on your wishes.',
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

            case 'asset-type-selection':
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

            case 'asset-distribution':
                return [
                    {
                        question: 'How should I distribute my assets?',
                        answer: "Consider your beneficiaries' needs and your relationships with them. You can distribute assets by percentage, specific items, or dollar amounts based on your preferences.",
                    },
                    {
                        question: 'What if the asset values change?',
                        answer: 'Percentage-based distributions automatically adjust to asset value changes. For specific dollar amounts, consider reviewing and updating your will periodically.',
                    },
                ];

            case 'executors':
                return [
                    {
                        question: 'Who should I choose as my executor?',
                        answer: 'Choose someone trustworthy, organized, and willing to handle the responsibilities. Consider their proximity, age, and ability to manage financial and legal matters.',
                    },
                    {
                        question: 'Can I have multiple executors?',
                        answer: 'Yes, you can appoint co-executors or alternate executors. Co-executors share responsibilities, while alternates serve if your primary executor cannot fulfill their duties.',
                    },
                ];

            case 'witnesses':
                return [
                    {
                        question: 'Who can serve as a witness?',
                        answer: 'Witnesses must be adults who are not beneficiaries in your will. They should be available to testify about your mental capacity and the signing process if needed.',
                    },
                    {
                        question: 'How many witnesses do I need?',
                        answer: 'Most jurisdictions require two witnesses for a will to be legally valid. Some areas may require additional witnesses or notarization.',
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
