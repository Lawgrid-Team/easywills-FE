// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Injectable({
//     providedIn: 'root',
// })
// export class NotificationService {
//     constructor(private snackBar: MatSnackBar) {}

//     showError(message: string) {
//         this.snackBar.open(message, 'Close', {
//             duration: 6000,
//             panelClass: 'notification-error',
//             verticalPosition: 'top',
//             horizontalPosition: 'right',
//         });
//     }
//     showWarning(message: string) {
//         this.snackBar.open(message, 'Close', {
//             duration: 5000,
//             panelClass: 'notification-warning',
//             verticalPosition: 'top',
//             horizontalPosition: 'right',
//         });
//     }
//     showSuccess(message: string) {
//         this.snackBar.open(message, 'Close', {
//             duration: 4000,
//             panelClass: 'notification-success',
//             verticalPosition: 'top',
//             horizontalPosition: 'right',
//         });
//     }
//     notify(message: string, cls: 0 | 1 = 1, duration = 5000, title = '') {
//         message =
//             typeof message == 'string'
//                 ? message
//                 : cls == 0
//                 ? 'An error occurred'
//                 : '';
//         return this.snackBar.open(message, title, {
//             duration,
//             horizontalPosition: 'center',
//             verticalPosition: 'bottom',
//             panelClass: cls == 1 ? 'bg-success' : 'bg-danger',
//         });
//     }
// }

import { Injectable } from '@angular/core';
import {
    MatSnackBar,
    MatSnackBarRef,
    TextOnlySnackBar,
} from '@angular/material/snack-bar';

type NotificationType = 'success' | 'warning' | 'error';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly defaultDurations: Record<NotificationType, number> = {
        success: 4000,
        warning: 5000,
        error: 6000,
    };

    constructor(private snackBar: MatSnackBar) {}

    private show(
        message: string,
        type: NotificationType,
        duration?: number,
    ): MatSnackBarRef<TextOnlySnackBar> {
        return this.snackBar.open(message, 'Close', {
            duration: duration ?? this.defaultDurations[type],
            panelClass: [`notification-${type}`],
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });
    }

    showError(
        message: string,
        duration?: number,
    ): MatSnackBarRef<TextOnlySnackBar> {
        return this.show(message, 'error', duration);
    }

    showWarning(
        message: string,
        duration?: number,
    ): MatSnackBarRef<TextOnlySnackBar> {
        return this.show(message, 'warning', duration);
    }

    showSuccess(
        message: string,
        duration?: number,
    ): MatSnackBarRef<TextOnlySnackBar> {
        return this.show(message, 'success', duration);
    }

    notify(
        message: string,
        isSuccess: boolean = true,
        duration = 5000,
        action = '',
    ): MatSnackBarRef<TextOnlySnackBar> {
        const sanitizedMessage =
            typeof message === 'string'
                ? message
                : isSuccess
                  ? ''
                  : 'An error occurred';

        return this.snackBar.open(sanitizedMessage, action, {
            duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: [
                isSuccess ? 'notification-success' : 'notification-error',
            ],
        });
    }
}
