import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssetInventoryData } from '../../../../core/models/interfaces/will-data.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { WizardHelpBoxComponent } from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { HelpFAQ } from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { WizardHelpService } from '../../../../shared/services/wizard-help.service';

type AssetFormType = 'real-estate' | 'bank-account' | null;

@Component({
    selector: 'app-asset-type-selection',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCardModule,
        CommonModule,
        WizardHelpBoxComponent,
    ],
    templateUrl: './asset-type-selection.component.html',
    styleUrl: './asset-type-selection.component.scss',
})
export class AssetTypeSelectionComponent {
    @Input() data!: AssetInventoryData;
    @Output() assetTypeSelect = new EventEmitter<AssetFormType>();
    @Output() editAsset = new EventEmitter<{
        type: AssetFormType;
        id: string;
    }>();

    helpFAQs: HelpFAQ[] = [];

    assetTypes = [
        {
            id: 'bank-account',
            name: 'Bank accounts',
            icon: 'icon_account',
            completed: false,
            count: 0,
        },
        {
            id: 'real-estate',
            name: 'Real Estate/Landed property',
            icon: 'icon_realestate',
            completed: false,
            count: 0,
        },
        {
            id: 'pension-funds',
            name: 'Pension Funds',
            icon: 'icon_pension',
            completed: false,
            count: 0,
        },
        {
            id: 'investments',
            name: 'Investments',
            icon: 'icon_investment',
            completed: false,
            count: 0,
        },
        {
            id: 'business',
            name: 'Business/Intellectual property',
            icon: 'icon_business',
            completed: false,
            count: 0,
        },
        {
            id: 'personal-valuables',
            name: 'Personal valuables',
            icon: 'icon_personalValuable',
            completed: false,
            count: 0,
        },
        {
            id: 'digital-assets',
            name: 'Digital assets',
            icon: 'icon_digitalAssets',
            completed: false,
            count: 0,
        },
        {
            id: 'cash-liquid',
            name: 'Cash/Liquid assets',
            icon: 'icon_cashAssets',
            completed: false,
            count: 0,
        },
    ];

    constructor(private helpService: WizardHelpService) {}

    ngOnInit(): void {
        this.helpFAQs = this.helpService.getFAQsForForm('asset-type-selection');
        // Update asset types with data
        this.assetTypes = this.assetTypes.map((type) => {
            if (type.id === 'bank-account') {
                return {
                    ...type,
                    completed:
                        this.data.completedAssetTypes.includes('bank-account'),
                    count: this.data.bankAccounts.length,
                };
            } else if (type.id === 'real-estate') {
                return {
                    ...type,
                    completed:
                        this.data.completedAssetTypes.includes('real-estate'),
                    count: this.data.realEstateProperties.length,
                };
            }
            return type;
        });
    }

    handleAssetTypeClick(assetTypeId: string): void {
        if (assetTypeId === 'bank-account') {
            this.assetTypeSelect.emit('bank-account');
        } else if (assetTypeId === 'real-estate') {
            this.assetTypeSelect.emit('real-estate');
        }
    }

    handleEditAsset(type: AssetFormType, id: string): void {
        this.editAsset.emit({ type, id });
    }
}
