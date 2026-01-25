/* eslint-disable @typescript-eslint/no-explicit-any */
import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {NotificationService} from '../../../core/utils/notification.service';
import {WillStateService} from '../../../shared/services/will-state.service';

@Component({
    selector: 'app-login',
    standalone: true,
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
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    hide = signal(true);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    public authService = inject(AuthService);
    public notification = inject(NotificationService);
    public router = inject(Router);

    constructor(private fb: FormBuilder,
                private willStateService: WillStateService
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.login(this.form.value).subscribe({
                next: (res: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const userRole = res.roles[0].authority;
                    //console.log(res, 'res');

                    switch (userRole) {
                        case 'USER':
                            this.willStateService.getWillState();
                            this.willStateService.willState$.subscribe({
                                next: (willState) => {
                                    if (willState) {
                                        if (willState.status === "completed" || (willState.stages && willState.stages.includes('SCHEDULE'))) {
                                            this.router.navigate(['/dashboard'], {
                                                replaceUrl: true,
                                            });
                                        } else {
                                            this.router.navigate(['/wiz'], {
                                                replaceUrl: true,
                                            });
                                        }
                                    }
                                },
                            });
                            break;
                        case 'ADMIN':
                            this.router.navigate(['/dashboard'], {
                                replaceUrl: true,
                            });
                            break;
                        case 'PARTNER_ADMIN':
                            this.router.navigate(['/lawyer'], {
                                replaceUrl: true,
                            });
                            break;
                        default:
                            this.router.navigate(['/wiz'], {
                                replaceUrl: true,
                            });
                    }
                    //this.router.navigate(['/wiz'], { replaceUrl: true });
                },
                error: (err: any) => {
                    this.notification.showError(err.error.message);
                },
                complete: () => {
                    this.notification.showSuccess('Login successful');
                },
            });
        }
    }
}
