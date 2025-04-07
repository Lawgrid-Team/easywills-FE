import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute , Params, Router} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/utils/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-verify-email',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './verify-email.component.html',
    styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
    loading: boolean = false;
    token: string = '';
    msg: string = '';
    errorMsg = 'We are unable to retrieve the requested element, most likely because it no longer exists, Invalid token';
    successMsg = 'Email successfully verified';
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private notify: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((param: Params) => {
            this.token = param['token'];
            if (!this.token) {
                this.notify.showError('Token is required');
                return this.router.navigate(['']);
            }
            return this.submit();
        });
    }

    submit() {
        if (!this.token) return;
        this.loading = true;
        this.auth
            .verifyToken(this.token)
            .subscribe({
                next: (res:any) => {
                    this.msg = res.message;
                    this.notify.showSuccess(this.msg);
                    //Email successfully verified
                },
                error: (err:any) => {
                    this.msg = err.error.message;
                    this.notify.showError(this.msg);
                    //this.msg = err.error.errors[0].split(',')[1];
                },
            })
            .add(() => (this.loading = false));
    }

    proceedToLogin() {
        this.router.navigate(['/auth/login', { replaceUrl: true }]);
      }
}
