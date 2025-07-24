import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-change-payment-method',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule],
    templateUrl: './change-payment-method.component.html',
    styleUrl: './change-payment-method.component.scss',
})
export class ChangePaymentMethodComponent {
    paymentForm: FormGroup;
    showSuccessModal = false;

    constructor(private fb: FormBuilder) {
        this.paymentForm = this.fb.group({
            cardHolderName: ['John Doe', Validators.required],
            cardNumber: ['385628993', Validators.required],
            expiryDate: ['12/27', Validators.required],
            cvv: ['082', Validators.required],
        });
    }

    onSubmit() {
        if (this.paymentForm.valid) {
            // Show success modal
            this.showSuccessModal = true;
        }
    }

    closeSuccessModal() {
        this.showSuccessModal = false;
    }
}
