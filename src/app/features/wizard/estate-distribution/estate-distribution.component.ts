import { Component, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from '../widget/header/header.component';
import { FooterComponent } from '../widget/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstateDistributionData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { IntroScreenComponent } from './intro-screen/intro-screen.component';
import { AssetDistributionFormComponent } from './asset-distribution-form/asset-distribution-form.component';
import { ExclusionFormComponent } from './exclusion-form/exclusion-form.component';
import { AssetType, BeneficiaryShare } from '../../../core/models/interfaces/asset.interface';

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
    assetTypeIcons : any = {
        'REAL_ESTATE': {
            id: 'REAL_ESTATE',
            name: 'Real Estate/Landed Property',
            icon: 'svg/asset-type-icons/real-estate.svg'
        },
        'BANK_ACCOUNT' : {
            id: 'BANK_ACCOUNT',
            name: 'Bank accounts',
            icon: 'svg/asset-type-icons/bank-accounts.svg'
        },
        'PENSION_FUND': {
            id: 'PENSION_FUND',
            name: 'Pension funds',
            icon: 'svg/asset-type-icons/pension-funds.svg'},
        'INVESTMENT': {
            id: 'INVESTMENT',
            name: 'Investments',
            icon: 'svg/asset-type-icons/investments.svg'
        },
        'BUSINESS_INTELLECTUAL_PROPERTY': {
            id: 'BUSINESS_INTELLECTUAL_PROPERTY',
            name: 'Business/ Intellectual property',
            icon: 'svg/asset-type-icons/intellectual-property.svg'
        },
        'PERSONAL_VALUABLE': {
            id: 'PERSONAL_VALUABLE',
            name: 'Personal valuables',
            icon: 'svg/asset-type-icons/personal-valuables.svg'
        },
        'DIGITAL_ASSET': {
            id: 'DIGITAL_ASSET',
            name: 'Digital assets',
            icon: 'svg/asset-type-icons/digital-assets.svg'
        },
        'CASH_LIQUID_ASSET': {
            id: 'CASH_LIQUID_ASSET',
            name: 'Cash/Liquid assets',
            icon: 'svg/asset-type-icons/liquid-assets.svg'
        }
    };

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {
        this.data = this.willDataService.getEstateDistribution();
    }

    ngOnInit(): void {
        this.willDataService.getBeneficiaries()
            .subscribe({
                next: ({children, spouses, beneficiaries}: any) => {
                    const beneficiariesHolder: BeneficiaryShare[] = [];
                    children.forEach((child: any) => {
                        beneficiariesHolder.push( {
                            id: child.id,
                            name: child.firstName + ' ' + child.lastName,
                            type: 'CHILD',
                            dateInfo: child.dateOfBirth,
                            percentage: 0,
                        })
                    });
                    spouses.forEach((spouse: any) => {
                        beneficiariesHolder.push( {
                            id: spouse.id,
                            name: spouse.firstName + ' ' + spouse.lastName,
                            type: 'SPOUSE',
                            dateInfo: spouse.dateOfBirth,
                            percentage: 0,
                        })
                    });
                    beneficiaries.forEach((beneficiary :any) => {
                        beneficiariesHolder.push( {
                            id: beneficiary.id,
                            name: beneficiary.firstName + ' ' + beneficiary.lastName,
                            type: beneficiary.type,
                            dateInfo: beneficiary.dateOfBirth,
                            percentage: 0,
                        })
                    });
                    this.data.beneficiaries = beneficiariesHolder;
                    this.willDataService.updateEstateDistribution({
                        beneficiaries: beneficiariesHolder,
                    });
                },
                error: (error: any) => {
                    console.error('Error fetching beneficiaries data:', error);
                }
            });

        this.willDataService.getAssetInventoryForDistribution()
            .subscribe({
                next: (data: any) => {
                    this.data.assets = this.extractAssetsForDistribution(data);
                    this.willDataService.updateEstateDistribution({
                        assets: this.data.assets,
                    });
                },
                error: (error) => {
                    console.error('Error fetching asset inventory data:', error);
                }
            });

        this.willDataService.getAssetDistribution()
            .subscribe({
                next: (data: EstateDistributionData) => {
                    data.beneficiaries = this.data.beneficiaries;
                    this.data = data;
                    this.willDataService.updateEstateDistribution(data);
                },
                error: (error) => {
                    console.error('Error fetching estate distribution data:', error);
                }
            });}

    updateData(newData: Partial<EstateDistributionData>): void {
        this.willDataService.updateEstateDistribution(newData);
        this.data = this.willDataService.getEstateDistribution();
    }

    handleNext(): void {
        if (this.step === 1) {
            // this.router.navigate(['/wiz/will/executor-and-witnesses']);
            this.willDataService.submitEstateDistribution();
            //TODO:: increment step only if the submission is successful
            this.step++;
        }
        else if (this.step === 2) {
            // this.router.navigate(['/wiz/will/executor-and-witnesses']);
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


    extractAssetsForDistribution(data: any[]): AssetType[] {
        if (!Array.isArray(data)) return [];
        // Group assets by assetType
        const grouped: { [key: string]: any[] } = {};
        data.forEach(asset => {
            if (!grouped[asset.assetType]) {
                grouped[asset.assetType] = [];
            }
            grouped[asset.assetType].push(asset);
        });
        return Object.keys(grouped).map(assetType => ({
            id: assetType,
            name: this.assetTypeIcons[assetType].name,
            icon: this.assetTypeIcons[assetType].icon,
            count: grouped[assetType].length,
            assets: grouped[assetType].map(asset => ({
                id: asset.id,
                name: asset.name || asset.title || asset.propertyTitle || asset.bankName,
                description: asset.description,
                address: asset.address,
                value: asset.value,
                lastUpdatedDate: asset.lastUpdatedDate,
                createdDate: asset.createdDate,
                assetType: asset.assetType,
                details: asset.details ?? null // Provide details or null if not present
            })),
            expanded: false
        }));
    }
}
