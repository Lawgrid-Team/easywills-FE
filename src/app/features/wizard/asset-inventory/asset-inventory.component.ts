import { Component } from '@angular/core';
import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';
import { Router } from '@angular/router';
import { AssetInventoryData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AssetIntroScreenComponent } from './asset-intro-screen/asset-intro-screen.component';
import { RealEstateFormComponent } from './real-estate-form/real-estate-form.component';
import { BankAccountFormComponent } from './bank-account-form/bank-account-form.component';
import { AssetTypeSelectionComponent } from './asset-type-selection/asset-type-selection.component';

type AssetFormType = 'real-estate' | 'bank-account' | null;

@Component({
    selector: 'app-asset-inventory',
    imports: [
        HeaderComponent,
        FooterComponent,
        MatIconModule,
        CommonModule,
        AssetIntroScreenComponent,
        AssetTypeSelectionComponent,
        RealEstateFormComponent,
        BankAccountFormComponent,
    ],
    templateUrl: './asset-inventory.component.html',
    styleUrl: './asset-inventory.component.scss',
})
export class AssetInventoryComponent {
    step = 0;
    data: AssetInventoryData;
    currentAssetForm: AssetFormType = null;
    editingAssetId: string | null = null;
    isFormValid = true;
    assetTypes: { type: AssetFormType; label: string }[] = [
        { type: 'real-estate', label: 'Real Estate' },
        { type: 'bank-account', label: 'Bank Account' },
    ];

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {
        this.data = this.willDataService.getAssetInventory();

        this.willDataService.getAssetInventoryFromBE()
        .subscribe({
            next: (data: AssetInventoryData) => {
                this.data = data;
            },
            error: (error) => {
                console.error('Error fetching asset inventory:', error);
            }
        });
    }

    ngOnInit(): void {}

    updateData(newData: Partial<AssetInventoryData>): void {
        this.willDataService.updateAssetInventory(newData);
        this.data = this.willDataService.getAssetInventory();
    }

    handleNext(): void {
        if (this.step === 1) {
            this.willDataService.submitAssetInventory(this.data);
            // this.router.navigate(['/wiz/will/estate-distribution']);
        } else {
            this.step++;
            window.scrollTo(0, 0);
        }
    }

    handleBack(): void {
        if (this.step === 0) {
            this.router.navigate(['wiz/will/personal-details']);
        } else if (this.currentAssetForm) {
            this.currentAssetForm = null;
            this.editingAssetId = null;
        } else {
            this.step--;
        }
        window.scrollTo(0, 0);
    }

    handleAssetTypeSelect(assetType: AssetFormType): void {
        this.currentAssetForm = assetType;
    }

    handleEditAsset(type: AssetFormType, id: string): void {
        this.currentAssetForm = type;
        this.editingAssetId = id;
    }

    handleAssetSaved(assetType: string): void {
        console.log('Asset saved:', assetType);
        if (!this.data.completedAssetTypes.includes(assetType)) {
            this.updateData({
                completedAssetTypes: [
                    ...this.data.completedAssetTypes,
                    assetType,
                ],
            });
        }
        this.currentAssetForm = null;
        this.editingAssetId = null;
    }

    onSaveAndExit(): void {
        this.willDataService.saveWillData();
        this.router.navigate(['wiz/welcome']);
    }
}
