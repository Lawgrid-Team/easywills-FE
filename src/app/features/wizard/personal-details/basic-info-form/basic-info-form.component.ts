import {
    Component,
    Input,
    Output,
    EventEmitter,
    type OnInit,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    type FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { type PersonalDetailsData } from '../../../../core/models/interfaces/will-data.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    WizardHelpBoxComponent,
    HelpFAQ,
} from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { WizardHelpService } from '../../../../shared/services/wizard-help.service';

@Component({
    selector: 'app-basic-info-form',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatCheckboxModule,
        CommonModule,
        WizardHelpBoxComponent,
    ],
    templateUrl: './basic-info-form.component.html',
    styleUrl: './basic-info-form.component.scss',
})
export class BasicInfoFormComponent {
    @Input() data!: PersonalDetailsData;
    @Output() updateData = new EventEmitter<Partial<PersonalDetailsData>>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    form!: FormGroup;

    checked = false;
    helpFAQs: HelpFAQ[] = [];

    constructor(
        private fb: FormBuilder,
        private helpService: WizardHelpService
    ) {}
    //private fb = inject(FormBuilder);

    ngOnInit(): void {
        // Initialize help FAQs
        this.helpFAQs = this.helpService.getFAQsForForm('basic-info');

        this.form = this.fb.group({
            title: [this.data.title, Validators.required],
            firstName: [
                this.data.firstName,
                [Validators.required, Validators.minLength(2)],
            ],
            lastName: [
                this.data.lastName,
                [Validators.required, Validators.minLength(2)],
            ],
            otherNames: [this.data.otherNames],
            hasUsedOtherNames: [this.data.hasUsedOtherNames],
            otherFullName: [this.data.otherFullName],
        });

        // Add conditional validation for otherFullName
        this.form
            .get('hasUsedOtherNames')
            ?.valueChanges.subscribe((hasUsedOtherNames) => {
                const otherFullNameControl = this.form.get('otherFullName');
                if (hasUsedOtherNames) {
                    otherFullNameControl?.setValidators([Validators.required]);
                } else {
                    otherFullNameControl?.clearValidators();
                }
                otherFullNameControl?.updateValueAndValidity();
            });

        // Update form validity whenever the form value changes
        this.form.statusChanges.subscribe(() => {
            this.setFormValidity.emit(this.form.valid);
            if (this.form.valid) {
                this.updateData.emit(this.form.value);
            }
        });

        // Initial form validity
        this.setFormValidity.emit(this.form.valid);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.updateData.emit(this.form.value);
            this.next.emit();
        }
    }
}
