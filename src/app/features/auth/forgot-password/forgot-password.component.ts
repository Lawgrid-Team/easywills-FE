import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/utils/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
     form!: FormGroup;
     loading: boolean = false;

     public authService = inject(AuthService);
     public notification = inject(NotificationService);
     public router = inject(Router);

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initializeForm();
      }
      initializeForm() {
        this.form = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
        });
      }
      onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.authService
          .forgotPassword(this.form.value.email)
          .subscribe({
            next: (res: any) => {
              this.initializeForm();
              this.notification.showSuccess(res.message);
              this.router.navigate([''], { replaceUrl: true });
            },
            error: (err:any) => {
              //console.log('err', err);
            },
          })
          .add(() => (this.loading = false));
      }

}
