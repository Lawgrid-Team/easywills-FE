import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private snackBar: MatSnackBar) {}

    showError(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 6000,
            panelClass: 'notification-error',
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });
    }
    showWarning(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: 'notification-warning',
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });
    }
    showSuccess(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 4000,
            panelClass: 'notification-success',
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });
    }
    notify(message: string, cls: 0 | 1 = 1, duration = 5000, title = '') {
        message =
            typeof message == 'string'
                ? message
                : cls == 0
                ? 'An error occurred'
                : '';
        return this.snackBar.open(message, title, {
            duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: cls == 1 ? 'bg-success' : 'bg-danger',
        });
    }
}
