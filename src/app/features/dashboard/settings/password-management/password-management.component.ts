import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { passwordMatchValidator } from '../../../../shared/validators/confirmPassword-validation';

@Component({
    selector: 'app-password-management',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule],
    templateUrl: './password-management.component.html',
    styleUrls: ['./password-management.component.scss'],
})
export class PasswordManagementComponent {
    passwordForm: FormGroup;
    hideCurrentPassword = true;
    hideNewPassword = true;
    hideConfirmPassword = true;

    constructor(private fb: FormBuilder) {
        this.passwordForm = this.fb.group(
            {
                currentPassword: ['', [Validators.required]],
                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                        ),
                    ],
                ],
                confirmPassword: ['', [Validators.required]],
            },
            { validators: passwordMatchValidator }
        );
    }

    get f() {
        return this.passwordForm.controls;
    }

    onSubmit() {
        if (this.passwordForm.valid) {
            console.log('Form Submitted!', this.passwordForm.value);
            // Handle password update logic here
        }
    }
}
