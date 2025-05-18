import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';
import { ExecutorsFormComponent } from './executors-form/executors-form.component';
import { IntroScreenComponent } from './intro-screen/intro-screen.component';
import { WitnessesFormComponent } from './witnesses-form/witnesses-form.component';
import { Router } from '@angular/router';
import { ExecutorAndWitnessData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';

@Component({
    selector: 'app-executor-and-witnesses',
    imports: [
        HeaderComponent,
        FooterComponent,
        IntroScreenComponent,
        ExecutorsFormComponent,
        WitnessesFormComponent,
        CommonModule,
    ],
    templateUrl: './executor-and-witnesses.component.html',
    styleUrl: './executor-and-witnesses.component.scss',
})
export class ExecutorAndWitnessesComponent {
    step = 0;
    data: ExecutorAndWitnessData;
    isFormValid = true;

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {
        this.data = this.willDataService.getExecutorAndWitness();
    }

    ngOnInit(): void {}

    updateData(newData: Partial<ExecutorAndWitnessData>): void {
        this.willDataService.updateExecutorAndWitness(newData);
        this.data = this.willDataService.getExecutorAndWitness();
    }

    handleNext(): void {
        if (this.step === 2) {
            this.router.navigate(['/wiz/will/review-and-download']);
        } else {
            this.step++;
            window.scrollTo(0, 0);
        }
    }

    handleBack(): void {
        if (this.step === 0) {
            this.router.navigate(['/wiz/will/asset-distribution']);
        } else {
            this.step--;
            window.scrollTo(0, 0);
        }
    }

    setFormValidity(isValid: boolean): void {
        this.isFormValid = isValid;
    }

    onSaveAndExit(): void {
        this.willDataService.saveWillData();
        this.router.navigate(['/wiz/welcome']);
    }
}
