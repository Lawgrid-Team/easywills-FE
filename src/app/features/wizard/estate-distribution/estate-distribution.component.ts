import { Component } from '@angular/core';
import { HeaderComponent } from '../widget/header/header.component';
import { FooterComponent } from '../widget/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstateDistributionData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { IntroScreenComponent } from './intro-screen/intro-screen.component';
import { AssetDistributionFormComponent } from './asset-distribution-form/asset-distribution-form.component';
import { ExclusionFormComponent } from './exclusion-form/exclusion-form.component';

@Component({
    selector: 'app-estate-distribution',
    imports: [
        HeaderComponent,
        FooterComponent,
        IntroScreenComponent,
        AssetDistributionFormComponent,
        ExclusionFormComponent,
        CommonModule,
    ],
    templateUrl: './estate-distribution.component.html',
    styleUrl: './estate-distribution.component.scss',
})
export class EstateDistributionComponent {
    step = 0;
    data: EstateDistributionData;
    isFormValid = true;

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {
        this.data = this.willDataService.getEstateDistribution();
    }

    ngOnInit(): void {}

    updateData(newData: Partial<EstateDistributionData>): void {
        this.willDataService.updateEstateDistribution(newData);
        this.data = this.willDataService.getEstateDistribution();
    }

    handleNext(): void {
        if (this.step === 2) {
            this.router.navigate(['/wiz/will/executor-and-witnesses']);
        } else {
            this.step++;
            window.scrollTo(0, 0);
        }
    }

    handleBack(): void {
        if (this.step === 0) {
            this.router.navigate(['/wiz/will/asset-inventory']);
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
