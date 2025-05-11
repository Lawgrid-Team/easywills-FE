import {
    Component,
    EventEmitter,
    Input,
    Output,
    type OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

// Interface for the data passed to this component
interface EstateDistributionData {
    sharingAsAWhole: boolean;
    beneficiaryShares?: { [key: string]: number };
    individualAssetAssignments?: { [assetId: string]: string }; // Maps asset ID to beneficiary ID
}

// Interface for beneficiary data
interface BeneficiaryShare {
    id: string;
    name: string;
    type: string;
    dateInfo: string;
    percentage: number;
}

// Interface for asset types
interface AssetType {
    id: string;
    name: string;
    icon: string;
    count: number;
    assets: Asset[];
}

// Interface for individual assets
interface Asset {
    id: string;
    name: string;
    details: string;
    assignedTo?: string; // Beneficiary ID
}

@Component({
    selector: 'app-asset-distribution-form',
    templateUrl: './asset-distribution-form.component.html',
    styleUrls: ['./asset-distribution-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatIconModule,
    ],
})
export class AssetDistributionFormComponent implements OnInit {
    @Input() data!: EstateDistributionData;
    @Output() updateData = new EventEmitter<EstateDistributionData>();
    @Output() next = new EventEmitter<void>();
    @Output() setFormValidity = new EventEmitter<boolean>();

    sharingAsAWhole = true;
    beneficiaryList: BeneficiaryShare[] = [];
    assetTypes: AssetType[] = [];

    // Dummy data for beneficiaries
    dummyBeneficiaries: BeneficiaryShare[] = [
        {
            id: '1',
            name: 'Child',
            type: 'Child',
            dateInfo: 'Born 10/10/1989',
            percentage: 0,
        },
        {
            id: '2',
            name: 'Child 2',
            type: 'Child',
            dateInfo: 'Born 10/10/1989',
            percentage: 0,
        },
        {
            id: '3',
            name: 'Spouse',
            type: 'Spouse',
            dateInfo: 'Born 10/10/1994, Married 12/24/1990',
            percentage: 0,
        },
    ];

    // Dummy data for asset types
    dummyAssetTypes: AssetType[] = [
        {
            id: 'bank-accounts',
            name: 'Bank accounts',
            icon: 'svg/asset-type-icons/bank-accounts.svg', // Path for icon to be uploaded later
            count: 2,
            assets: [
                {
                    id: 'bank1',
                    name: 'Savings Account',
                    details: 'Bank of America - #1234',
                },
                {
                    id: 'bank2',
                    name: 'Checking Account',
                    details: 'Chase Bank - #5678',
                },
            ],
        },
        {
            id: 'pension-funds',
            name: 'Pension funds',
            icon: 'svg/asset-type-icons/pension-funds.svg', // Path for icon to be uploaded later
            count: 1,
            assets: [
                {
                    id: 'pension1',
                    name: 'Retirement Fund',
                    details: 'Fidelity - #9012',
                },
            ],
        },
        {
            id: 'investments',
            name: 'Investments',
            icon: 'svg/asset-type-icons/investments.svg', // Path for icon to be uploaded later
            count: 1,
            assets: [
                {
                    id: 'investment1',
                    name: 'Stock Portfolio',
                    details: 'Vanguard - #3456',
                },
            ],
        },
        {
            id: 'real-estate',
            name: 'Real estate/landed property',
            icon: 'svg/asset-type-icons/real-estate.svg', // Path for icon to be uploaded later
            count: 2,
            assets: [
                {
                    id: 'property1',
                    name: 'Primary Residence',
                    details: '123 Main St, Anytown',
                },
                {
                    id: 'property2',
                    name: 'Vacation Home',
                    details: '456 Beach Rd, Coastville',
                },
            ],
        },
        {
            id: 'business',
            name: 'Business/ Intellectual property',
            icon: 'svg/asset-type-icons/intellectual-property.svg', // Path for icon to be uploaded later
            count: 1,
            assets: [
                {
                    id: 'business1',
                    name: 'Small Business',
                    details: 'ABC Company LLC',
                },
            ],
        },
        {
            id: 'valuables',
            name: 'Personal valuables',
            icon: 'svg/asset-type-icons/personal-valuables.svg', // Path for icon to be uploaded later
            count: 3,
            assets: [
                {
                    id: 'valuable1',
                    name: 'Jewelry Collection',
                    details: 'Safe deposit box #789',
                },
                {
                    id: 'valuable2',
                    name: 'Art Collection',
                    details: 'Home storage',
                },
                {
                    id: 'valuable3',
                    name: 'Antique Furniture',
                    details: 'Home storage',
                },
            ],
        },
        {
            id: 'digital',
            name: 'Digital assets',
            icon: 'svg/asset-type-icons/digital-assets.svg', // Path for icon to be uploaded later
            count: 2,
            assets: [
                {
                    id: 'digital1',
                    name: 'Cryptocurrency',
                    details: 'Bitcoin & Ethereum',
                },
                {
                    id: 'digital2',
                    name: 'Digital Media',
                    details: 'Photos & Music',
                },
            ],
        },
        {
            id: 'cash',
            name: 'Cash/Liquid assets',
            icon: 'svg/asset-type-icons/liquid-assets.svg', // Path for icon to be uploaded later
            count: 1,
            assets: [
                {
                    id: 'cash1',
                    name: 'Emergency Fund',
                    details: 'Money Market Account',
                },
            ],
        },
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // Initialize with data from parent component
        this.sharingAsAWhole = this.data?.sharingAsAWhole ?? true;

        // Initialize with dummy data
        this.beneficiaryList = [...this.dummyBeneficiaries];
        this.assetTypes = [...this.dummyAssetTypes];

        // If we have existing data, apply the percentages
        if (this.data?.beneficiaryShares) {
            this.beneficiaryList.forEach((beneficiary) => {
                if (
                    this.data.beneficiaryShares &&
                    this.data.beneficiaryShares[beneficiary.id]
                ) {
                    beneficiary.percentage =
                        this.data.beneficiaryShares[beneficiary.id];
                }
            });
        }

        // If we have existing individual asset assignments, apply them
        if (this.data?.individualAssetAssignments) {
            this.assetTypes.forEach((assetType) => {
                assetType.assets.forEach((asset) => {
                    if (
                        this.data.individualAssetAssignments &&
                        this.data.individualAssetAssignments[asset.id]
                    ) {
                        asset.assignedTo =
                            this.data.individualAssetAssignments[asset.id];
                    }
                });
            });
        }

        // Check initial form validity
        this.checkFormValidity();
    }

    // Handle radio button selection
    handleEstateDistributionType(type: string): void {
        this.sharingAsAWhole = type === 'yes';

        // Update data
        const updatedData: EstateDistributionData = {
            sharingAsAWhole: this.sharingAsAWhole,
        };

        // Include appropriate data based on distribution type
        if (this.sharingAsAWhole) {
            updatedData.beneficiaryShares = this.getBeneficiaryShares();
        } else {
            updatedData.individualAssetAssignments =
                this.getIndividualAssetAssignments();
        }

        this.updateData.emit(updatedData);

        // Check form validity
        this.checkFormValidity();
    }

    // Calculate remaining percentage
    getRemainingPercentage(): number {
        const totalAllocated = this.beneficiaryList.reduce(
            (sum, beneficiary) => sum + (beneficiary.percentage || 0),
            0
        );
        return 100 - totalAllocated;
    }

    // Get beneficiary shares as a map
    getBeneficiaryShares(): { [key: string]: number } {
        const beneficiaryShares: { [key: string]: number } = {};

        this.beneficiaryList.forEach((beneficiary) => {
            beneficiaryShares[beneficiary.id] = beneficiary.percentage || 0;
        });

        return beneficiaryShares;
    }

    // Get individual asset assignments as a map
    getIndividualAssetAssignments(): { [assetId: string]: string } {
        const assignments: { [assetId: string]: string } = {};

        this.assetTypes.forEach((assetType) => {
            assetType.assets.forEach((asset) => {
                if (asset.assignedTo) {
                    assignments[asset.id] = asset.assignedTo;
                }
            });
        });

        return assignments;
    }

    // Update percentage for a beneficiary
    updatePercentage(beneficiary: BeneficiaryShare, value: number): void {
        beneficiary.percentage = value;

        // Update data
        this.updateData.emit({
            sharingAsAWhole: this.sharingAsAWhole,
            beneficiaryShares: this.getBeneficiaryShares(),
        });

        // Check form validity
        this.checkFormValidity();
    }

    // Handle focus on percentage input
    onPercentageFocus(event: FocusEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const container = inputElement.closest('.percentage-input-container');

        if (container) {
            container.classList.add('focused');
        }
    }

    // Handle blur on percentage input
    onPercentageBlur(event: FocusEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const container = inputElement.closest('.percentage-input-container');

        if (container) {
            container.classList.remove('focused');
        }
    }

    // Remove a beneficiary (set percentage to 0)
    removeBeneficiary(id: string): void {
        const beneficiary = this.beneficiaryList.find((b) => b.id === id);
        if (beneficiary) {
            beneficiary.percentage = 0;

            // Update data
            this.updateData.emit({
                sharingAsAWhole: this.sharingAsAWhole,
                beneficiaryShares: this.getBeneficiaryShares(),
            });

            // Check form validity
            this.checkFormValidity();
        }
    }

    // Check if form is valid
    checkFormValidity(): void {
        let isValid = true;

        if (this.sharingAsAWhole) {
            // For sharing as a whole, total must equal 100%
            isValid = this.getRemainingPercentage() === 0;
        } else {
            // For sharing individually, all assets must be assigned
            // This is a placeholder - we'll implement this later
            isValid = true;
        }

        this.setFormValidity.emit(isValid);
    }

    // Form submission
    onSubmit(): void {
        const updatedData: EstateDistributionData = {
            sharingAsAWhole: this.sharingAsAWhole,
        };

        if (this.sharingAsAWhole) {
            updatedData.beneficiaryShares = this.getBeneficiaryShares();
        } else {
            updatedData.individualAssetAssignments =
                this.getIndividualAssetAssignments();
        }

        this.updateData.emit(updatedData);
        this.next.emit();
    }
}
