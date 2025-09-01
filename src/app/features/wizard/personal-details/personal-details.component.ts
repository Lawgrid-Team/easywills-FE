import {Component, type OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FooterComponent} from '../widget/footer/footer.component';
import {HeaderComponent} from '../widget/header/header.component';
import {IntroScreenComponent} from './intro-screen/intro-screen.component';
import {BasicInfoFormComponent} from './basic-info-form/basic-info-form.component';
import {CommonModule} from '@angular/common';
import {PersonalDetailsData} from '../../../core/models/interfaces/will-data.interface';
import {WillDataService} from '../../../core/services/Wizard/will-data.service';
import {BirthInfoFormComponent} from './birth-info-form/birth-info-form.component';
import {AddressInfoFormComponent} from './address-info-form/address-info-form.component';
import {MaritalStatusFormComponent} from './marital-status-form/marital-status-form.component';
import {ChildrenFormComponent} from './children-form/children-form.component';
import {BeneficiariesFormComponent} from './beneficiaries-form/beneficiaries-form.component';

@Component({
    selector: 'app-personal-details',
    imports: [
        HeaderComponent,
        FooterComponent,
        IntroScreenComponent,
        BasicInfoFormComponent,
        BirthInfoFormComponent,
        AddressInfoFormComponent,
        MaritalStatusFormComponent,
        ChildrenFormComponent,
        BeneficiariesFormComponent,
        CommonModule,
    ],
    templateUrl: './personal-details.component.html',
    styleUrl: './personal-details.component.scss',
})
export class PersonalDetailsComponent implements OnInit {
    step = 0;
    data: PersonalDetailsData;
    isFormValid = true;

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {
        this.data = this.willDataService.getPersonalDetails();
        this.willDataService.getPersonalDetailsFromBE()
        .subscribe({
            next: (data: PersonalDetailsData) => {
                this.data = data;
            },
            error: (error) => {
                console.error('Error fetching personal details:', error);
            }
        });
    }

    ngOnInit(): void {}

    updateData(newData: Partial<PersonalDetailsData>): void {
        this.willDataService.updatePersonalDetails(newData);
        this.data = this.willDataService.getPersonalDetails();
    }

    handleNext(): void {
        if (this.step === 3) {
            this.willDataService.submitTestatorProfile(this.data);
        }

        if (this.step === 6) {
            this.willDataService.submitBeneficiaries(this.data);
            this.router.navigate(['/wiz/will/asset-inventory']);

        } else {
            this.step++;
            window.scrollTo(0, 0);
        }
    }

    handleBack(): void {
        if (this.step === 0) {
            this.router.navigate(['/wiz/welcome']);
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
