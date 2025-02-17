import {
    ChangeDetectionStrategy,
    Component,
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
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
    form!: FormGroup;
    hide = signal(true);
    hide2 = signal(true);

    constructor(private fb: FormBuilder) {}

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    clickEvent2(event: MouseEvent) {
        this.hide2.set(!this.hide2());
        event.stopPropagation();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    ),
                ],
            ],
            confirmPassword: ['', Validators.required],
            terms: [false, Validators.requiredTrue],
        });
    }

    onSubmit() {
        console.log(this.form.value, 'form value');
    }
}
