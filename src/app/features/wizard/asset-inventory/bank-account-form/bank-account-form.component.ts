import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    AssetInventoryData,
    BankAccount,
} from '../../../../core/models/interfaces/will-data.interface';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-bank-account-form',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCardModule,
        CommonModule,
    ],
    templateUrl: './bank-account-form.component.html',
    styleUrl: './bank-account-form.component.scss',
})
export class BankAccountFormComponent implements OnInit {
    @Input() data!: AssetInventoryData;
    @Input() editingAssetId: string | null = null;
    @Output() updateData = new EventEmitter<Partial<AssetInventoryData>>();
    @Output() save = new EventEmitter<void>();

    form!: FormGroup;
    showForm = false;

    accountTypes = [
        { value: 'Savings account', viewValue: 'Savings account' },
        { value: 'Checking account', viewValue: 'Checking account' },
        { value: 'Money market account', viewValue: 'Money market account' },
        {
            value: 'Certificate of deposit',
            viewValue: 'Certificate of deposit',
        },
        { value: 'Other', viewValue: 'Other' },
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            accountType: ['', Validators.required],
            institution: ['', Validators.required],
            accountNumber: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(4),
                    Validators.pattern('[0-9]{4}'),
                ],
            ],
        });

        // Show form if no accounts exist or if editing an existing account
        this.showForm =
            this.data.bankAccounts.length === 0 || this.editingAssetId !== null;

        if (this.editingAssetId) {
            const accountToEdit = this.data.bankAccounts.find(
                (account) => account.id === this.editingAssetId
            );
            if (accountToEdit) {
                this.form.patchValue(accountToEdit);
            }
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            if (this.editingAssetId) {
                // Update existing account
                const updatedAccounts = this.data.bankAccounts.map((account) =>
                    account.id === this.editingAssetId
                        ? ({
                              ...this.form.value,
                              id: this.editingAssetId,
                          } as BankAccount)
                        : account
                );
                this.updateData.emit({ bankAccounts: updatedAccounts });
            } else {
                // Add new account
                const newAccount = {
                    ...this.form.value,
                    id: uuidv4(),
                } as BankAccount;
                this.updateData.emit({
                    bankAccounts: [...this.data.bankAccounts, newAccount],
                });
            }

            // After saving, hide form and show cards view instead of navigating away
            this.showForm = false;
            this.editingAssetId = null;
            this.form.reset();

            // Only emit save for overall completion, not individual account saves
            // this.save.emit();
        }
    }

    onAddAnother(): void {
        if (this.data.bankAccounts.length > 0 && !this.showForm) {
            // When accounts exist and form is not shown, show the form to add another
            this.showForm = true;
            this.editingAssetId = null; // Clear editing mode
            this.form.reset({
                accountType: '',
                institution: '',
                accountNumber: '',
            });
        } else if (this.form.valid) {
            // Original behavior for when in form mode
            const newAccount = {
                ...this.form.value,
                id: uuidv4(),
            } as BankAccount;
            this.updateData.emit({
                bankAccounts: [...this.data.bankAccounts, newAccount],
            });

            // Reset form for next account
            this.form.reset({
                accountType: '',
                institution: '',
                accountNumber: '',
            });
        }
    }

    editAccount(accountId: string): void {
        // Set editing mode and populate form with account data
        this.editingAssetId = accountId;
        this.showForm = true;
        const accountToEdit = this.data.bankAccounts.find(
            (account) => account.id === accountId
        );
        if (accountToEdit) {
            this.form.patchValue(accountToEdit);
        }
    }

    saveAllAccounts(): void {
        // Emit save event to parent component
        this.save.emit();
    }

    onCancel(): void {
        // Hide form and show cards view
        this.showForm = false;
        this.editingAssetId = null;
        this.form.reset();
    }

    deleteAccount(accountId: string): void {
        // Remove the account from the data
        const updatedAccounts = this.data.bankAccounts.filter(
            (account) => account.id !== accountId
        );
        this.updateData.emit({ bankAccounts: updatedAccounts });

        // If we were editing this account, clear the editing state
        if (this.editingAssetId === accountId) {
            this.editingAssetId = null;
            this.showForm = false;
            this.form.reset();
        }

        // If no accounts remain, show the form to add the first account
        if (updatedAccounts.length === 0) {
            this.showForm = true;
        }
    }
}
