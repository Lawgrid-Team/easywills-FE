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
import { firstValueFrom, forkJoin } from 'rxjs';

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
    loadingData = true;
    private originalData: ExecutorAndWitnessData | null = null;

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {
        this.data = this.willDataService.getExecutorAndWitness();
    }

    async ngOnInit(): Promise<void> {
        try {

            const result: any = await firstValueFrom(
                forkJoin({
                    executors: this.willDataService.getExecutors(),
                    witnesses: this.willDataService.getWitnesses(),
                })
            );

            this.loadingData = false;

            this.data.executors = result.executors || [];
            this.data.hasExecutor = this.data.executors.length > 0;
            this.data.witnesses = result.witnesses || [];
            this.data.hasWitnesses = this.data.witnesses.length > 0;

            this.originalData = this.willDataService.getExecutorAndWitness();
        } catch (error) {
            console.error('Error fetching estate distribution data:', error);
        }
    }

    updateData(newData: Partial<ExecutorAndWitnessData>): void {
        this.willDataService.updateExecutorAndWitness(newData);
        this.data = this.willDataService.getExecutorAndWitness();
    }

    async handleNext(): Promise<void> {
        if(this.step == 1){
            if (this.originalData) {
                if(JSON.stringify(this.originalData.executors) !== JSON.stringify(this.data.executors)) {
                    await this.willDataService.submitExecutors().then(() => {
                        this.data = this.willDataService.getExecutorAndWitness();
                    });
                }
            }
            this.step++;
            window.scrollTo(0, 0);
            return;
        }
        else if (this.step === 2) {
            if (this.originalData) {
                if(JSON.stringify(this.originalData.witnesses) !== JSON.stringify(this.data.witnesses)) {
                    await this.willDataService.submitWitnesses().then(() => {
                        this.data = this.willDataService.getExecutorAndWitness();
                    });
                }
            }
            this.router.navigate(['/wiz/will/review-and-download']);
            return;
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
