import { Component, OnInit, signal, inject } from '@angular/core';
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
import { Router } from '@angular/router';

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
        RouterModule
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

    constructor(private fb: FormBuilder) {}

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

                this.router.navigate(['/wiz'], { replaceUrl: true });
                    // if (res.status === 200) {
                    //     this.notification.showSuccess(
                    //         res.message
                    //     );
                    //     this.router.navigate(['/wiz'], { replaceUrl: true });
                    // } else {
                    //     this.notification.showError(res.message);
                    //     this.notification.showError(res.msg);
                    // }

                },
                error: (err: any) => {
                    this.notification.showError(err.error.message);
                },
                // complete: () => {
                //     console.log('complete');
                // },
            });
        }
    }
}
