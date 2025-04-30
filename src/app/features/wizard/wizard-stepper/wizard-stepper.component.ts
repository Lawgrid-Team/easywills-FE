import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

export interface Step {
    id: string;
    label: string;
}
@Component({
    selector: 'app-wizard-stepper',
    imports: [MatIconModule, CommonModule],
    templateUrl: './wizard-stepper.component.html',
    styleUrl: './wizard-stepper.component.scss',
})
export class WizardStepperComponent {
    @Input() steps: Step[] = [];
    @Input() currentStep = 0;
}
