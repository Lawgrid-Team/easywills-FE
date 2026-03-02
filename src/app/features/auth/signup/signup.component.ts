import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/utils/notification.service';

@Component({
    selector: 'app-signup',
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
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
    form!: FormGroup;
    hide = signal(true);
    hide2 = signal(true);

    public aService = inject(AuthService);
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private notification: NotificationService,
    ) {}

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    clickEvent2(event: MouseEvent) {
        this.hide2.set(!this.hide2());
        event.stopPropagation();
    }

    ngOnInit(): void {
        this.form = this.fb.group(
            {
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        ),
                    ],
                ],
                passwordValid: [false],
                confirmPassword: ['', Validators.required],
                terms: [false, Validators.requiredTrue],
            },
            { validator: this.checkPasswords.bind(this) },
        );

        // set passwordValid to true if password and confirmPassword are valid
        this.form.valueChanges.subscribe((val) => {
            const password = this.form.get('password');
            const confirmPassword = this.form.get('confirmPassword');
            const passwordValid = this.form.get('passwordValid');

            const isValid = password?.valid && confirmPassword?.valid;

            if (passwordValid?.value !== isValid) {
                passwordValid?.setValue(isValid, { emitEvent: false }); //prevent loop
            }
        });
    }

    checkPasswords(form: FormGroup) {
        const { confirmPassword, password } = form.controls;
        if (confirmPassword.value && confirmPassword.value != password.value) {
            confirmPassword.setErrors({ notSame: true });
            return { notSame: true };
        } else {
            return null;
        }
    }

    onSubmit() {
        console.log(this.form.value, 'form value');
        this.authService.register(this.form.value).subscribe({
            next: (res) => {
                // if (res.status === 200 || res.status === 201) {
                //     this.notification.showSuccess(
                //         'Account created successfully, check your email to verify your account',
                //     );
                //     this.router.navigate(['/auth/login']);
                // }

                if (res) {
                    this.notification.showSuccess(
                        res.message ||
                            'Account created successfully, check your email to verify your account',
                    );
                    this.router.navigate(['/auth/login']);
                }
            },
            error: (err) => {
                this.notification.showError(err.error.message);
                console.log(err);
            },
            complete: () => {
                console.log('complete');
            },
        });
    }
}
