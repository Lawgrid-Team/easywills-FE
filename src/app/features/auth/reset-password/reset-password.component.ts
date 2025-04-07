import { Component, signal, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/utils/notification.service';
import { Router, Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
    form!: FormGroup;
    hide = signal(true);
    hide2 = signal(true);
    token: string = '';
    loading: boolean = false;

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }
    clickEvent2(event: MouseEvent) {
        this.hide2.set(!this.hide2());
        event.stopPropagation();
    }

    public authService = inject(AuthService);
    public notification = inject(NotificationService);
    public router = inject(Router);
    private route = inject(ActivatedRoute);

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.initializeForm();
        this.route.queryParams.subscribe((param: Params) => {
            this.token = param['token'];
            if (!this.token) {
                this.notification.showError('Token is required');
                return this.router.navigate(['/auth/fotgot-password']);
            }
            return this.form.patchValue({
                token: param['token'],
            });
        });
    }

    initializeForm() {
        this.form = this.fb.group(
            {
                token: ['', [Validators.required]],
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
                passwordValid: [false],
            },
            { validator: this.checkPasswords.bind(this) }
        );

        // set passwordValid to true if password and confirmPassword are valid
        this.form.valueChanges.subscribe((val) => {
            const newPassword = this.form.get('newPassword');
            const confirmPassword = this.form.get('confirmPassword');
            const passwordValid = this.form.get('passwordValid');

            const isValid = newPassword?.valid && confirmPassword?.valid;

            if (passwordValid?.value !== isValid) {
                passwordValid?.setValue(isValid, { emitEvent: false }); //prevent loop
            }
        });
    }

    checkPasswords(form: FormGroup) {
        const { confirmPassword, newPassword } = form.controls;
        if (
            confirmPassword.value &&
            confirmPassword.value != newPassword.value
        ) {
            confirmPassword.setErrors({ notSame: true });
            return { notSame: true };
        } else {
            return null;
        }
    }

    onSubmit() {
        //console.log(this.form.value, 'form value');

        if (this.form.invalid) return;
        this.loading = true;
        this.authService
            .resetPassword(this.form.value)
            .subscribe({
                next: (res) => {
                    //console.log('res', res);
                    this.initializeForm();
                    this.notification.showSuccess(res.message);
                    this.router.navigate(['/auth/login'], { replaceUrl: true });
                },
                error: (err) => {
                    console.log(err.error.message);
                    this.notification.showError(err.error.message);
                    console.log('wholeError', err);
                },
            })
            .add(() => (this.loading = false));
    }
}
