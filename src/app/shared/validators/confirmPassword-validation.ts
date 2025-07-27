import type {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (
        !newPassword ||
        !confirmPassword ||
        !newPassword.value ||
        !confirmPassword.value
    ) {
        return null;
    }

    if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        return null;
    }

    if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
    } else {
        confirmPassword.setErrors(null);
        return null;
    }
};
