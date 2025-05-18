import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class BankAccountFormComponent {
    @Input() data!: AssetInventoryData;
    @Input() editingAssetId: string | null = null;
    @Output() updateData = new EventEmitter<Partial<AssetInventoryData>>();
    @Output() save = new EventEmitter<void>();

    form!: FormGroup;

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
            this.save.emit();
        }
    }

    onAddAnother(): void {
        if (this.form.valid) {
            // Add current account
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
}
