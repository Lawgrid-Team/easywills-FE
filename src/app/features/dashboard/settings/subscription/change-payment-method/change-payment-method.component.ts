import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-change-payment-method',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './change-payment-method.component.html',
    styleUrl: './change-payment-method.component.scss',
})
export class ChangePaymentMethodComponent {
    paymentForm: FormGroup;

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
            console.log('Form Submitted!', this.paymentForm.value);
            // Handle form submission logic here
        }
    }
}
