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
import { BeneficiaryShare, AssetType, Asset, BeneficiaryAssignment } from '../../../../core/models/interfaces/asset.interface';
import { EstateDistributionData } from '../../../../core/models/interfaces/will-data.interface';
import { WizardHelpBoxComponent } from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { HelpFAQ } from '../../../../shared/components/wizard-help-box/wizard-help-box.component';
import { WizardHelpService } from '../../../../shared/services/wizard-help.service';

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
        WizardHelpBoxComponent,
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
    helpFAQs: HelpFAQ[] = [];

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
            id: 'real-estate',
            name: 'Real Estate/Landed Property',
            icon: 'svg/asset-type-icons/real-estate.svg',
            count: 2,
            expanded: false,
            assets: [
                {
                    id: 'property1',
                    name: 'Commercial property',
                    details: 'Commercial property',
                    ownershipType: 'Sole owner',
                    address:
                        '5400 Awolowo Road, Off Obafemi Isabu Crescent, Lagos State, L899NO',
                },
                {
                    id: 'property2',
                    name: 'Residential property',
                    details: 'Residential property',
                    ownershipType: 'Sole owner',
                    address:
                        '5400 Awolowo Road, Off Obafemi Isabu Crescent, Lagos State, L899NO',
                },
            ],
        },
        {
            id: 'bank-accounts',
            name: 'Bank accounts',
            icon: 'svg/asset-type-icons/bank-accounts.svg',
            count: 2,
            expanded: false,
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
            icon: 'svg/asset-type-icons/pension-funds.svg',
            count: 1,
            expanded: false,
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
            icon: 'svg/asset-type-icons/investments.svg',
            count: 1,
            expanded: false,
            assets: [
                {
                    id: 'investment1',
                    name: 'Stock Portfolio',
                    details: 'Vanguard - #3456',
                },
            ],
        },
        {
            id: 'business',
            name: 'Business/ Intellectual property',
            icon: 'svg/asset-type-icons/intellectual-property.svg',
            count: 1,
            expanded: false,
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
            icon: 'svg/asset-type-icons/personal-valuables.svg',
            count: 3,
            expanded: false,
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
            icon: 'svg/asset-type-icons/digital-assets.svg',
            count: 2,
            expanded: false,
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
            icon: 'svg/asset-type-icons/liquid-assets.svg',
            count: 1,
            expanded: false,
            assets: [
                {
                    id: 'cash1',
                    name: 'Emergency Fund',
                    details: 'Money Market Account',
                },
            ],
        },
    ];

    constructor(private fb: FormBuilder, private helpService: WizardHelpService) {}

    ngOnInit(): void {
        this.helpFAQs = this.helpService.getFAQsForForm('asset-distribution-form');
        // Initialize with data from parent component
        this.sharingAsAWhole = this.data.sharingAsAWhole;

        this.beneficiaryList = this.data.beneficiaries || [];
        //TODO:: check here if all asset types are not listed
        this.assetTypes = this.data.assets || [];

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

        // Initialize remaining share for all assets
        this.assetTypes.forEach((assetType) => {
            assetType.assets.forEach((asset) => {
                // Initialize beneficiaries array if not exists
                if (!asset.beneficiaries) {
                    asset.beneficiaries = [];
                }
                //add existing beneficiaries to the asset
                if (this.data.individualAssetAssignments && this.data.individualAssetAssignments[asset.id]) {
                    asset.beneficiaries = this.data.individualAssetAssignments[asset.id];
                }

                // Calculate remaining share
                asset.remainingShare = this.calculateRemainingShare(asset);
            });
        });
    // })

        // Check initial form validity
        this.checkFormValidity();
    }

    // Handle radio button selection
    handleEstateDistributionType(type: string): void {
        this.sharingAsAWhole = type === 'yes';

        // Update data
        const updatedData: EstateDistributionData = {
            sharingAsAWhole: this.sharingAsAWhole,
            exclusions: this.data.exclusions || [],
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

    // Toggle asset type expansion
    toggleAssetType(assetType: AssetType): void {
        // Close all other asset types
        this.assetTypes.forEach((type) => {
            if (type.id !== assetType.id) {
                type.expanded = false;
            }
        });

        // Toggle the clicked asset type
        assetType.expanded = !assetType.expanded;
    }

    // Calculate remaining share for an asset:
    calculateRemainingShare(asset: Asset): number {
        if (!asset.beneficiaries || asset.beneficiaries.length === 0) {
            return 100;
        }

        const totalAllocated = asset.beneficiaries.reduce(
            (sum, assignment) => sum + assignment.percentage,
            0
        );
        return 100 - totalAllocated;
    }

    // Assign beneficiary to an asset:
    assignBeneficiary(asset: Asset): void {
        // In a real implementation, this would open a dialog
        // For now, we'll simulate adding beneficiaries

        if (!asset.beneficiaries) {
            asset.beneficiaries = [];
        }

        // Show the assignments section
        asset.showAssignments = true;

        // Find beneficiaries not yet assigned to this asset
        const unassignedBeneficiaries = this.beneficiaryList.filter(
            (beneficiary) =>
                !asset.beneficiaries?.some(
                    (assignment) => assignment.beneficiaryId === beneficiary.id
                )
        );

        if (unassignedBeneficiaries.length > 0) {
            // Assign the first unassigned beneficiary with a default percentage
            const beneficiary = unassignedBeneficiaries[0];
            const remainingShare = this.calculateRemainingShare(asset);

            asset.beneficiaries.push({
                beneficiaryId: beneficiary.id,
                percentage: remainingShare > 0 ? remainingShare : 0,
            });

            // Update the remaining share
            asset.remainingShare = this.calculateRemainingShare(asset);

            // Update data
            this.updateIndividualAssetAssignments();
        }
    }

    // Update beneficiary percentage for an asset:
    updateBeneficiaryPercentage(
        asset: Asset,
        beneficiaryId: string,
        percentage: number
    ): void {
        if (!asset.beneficiaries) return;

        const assignment = asset.beneficiaries.find(
            (a) => a.beneficiaryId === beneficiaryId
        );
        if (assignment) {
            assignment.percentage = percentage;
            asset.remainingShare = this.calculateRemainingShare(asset);

            // Update data
            this.updateIndividualAssetAssignments();
        }
    }

    // Remove a beneficiary from an asset:
    removeBeneficiaryFromAsset(asset: Asset, beneficiaryId: string): void {
        if (!asset.beneficiaries) return;

        asset.beneficiaries = asset.beneficiaries.filter(
            (a) => a.beneficiaryId !== beneficiaryId
        );
        asset.remainingShare = this.calculateRemainingShare(asset);

        // Update data
        this.updateIndividualAssetAssignments();
    }

    // Save beneficiary assignments for an asset:
    saveAssetAssignments(asset: Asset): void {
        // In a real implementation, this would save to a database
        // For now, we'll just update the UI state
        asset.remainingShare = this.calculateRemainingShare(asset);

        // Hide the assignments section
        asset.showAssignments = false;

        // Update data
        this.updateIndividualAssetAssignments();

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
    getIndividualAssetAssignments(): { [assetId: string]: BeneficiaryAssignment[] } {
        const assignments: { [assetId: string]: BeneficiaryAssignment[] } = {};

        this.assetTypes.forEach((assetType) => {
            assetType.assets.forEach((asset) => {
                if (asset.beneficiaries && asset.beneficiaries.length > 0) {
                    const assigned = assignments[asset.id] || []
                    assigned.push(...asset.beneficiaries)
                    assignments[asset.id] = assigned
                }
            });
        });

        return assignments;
    }

    // Update individual asset assignments:
    updateIndividualAssetAssignments(): void {
        // Update data
        this.updateData.emit({
            sharingAsAWhole: this.sharingAsAWhole,
            individualAssetAssignments: this.getIndividualAssetAssignments(),
            exclusions: this.data.exclusions || [],
        });

        // Check form validity
        this.checkFormValidity();
    }

    // Update percentage for a beneficiary
    updatePercentage(beneficiary: BeneficiaryShare, value: number): void {
        beneficiary.percentage = value;

        // Update data
        this.updateData.emit({
            sharingAsAWhole: this.sharingAsAWhole,
            beneficiaryShares: this.getBeneficiaryShares(),
            exclusions: this.data.exclusions || [],
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
                exclusions: this.data.exclusions || [],
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
            let allAssetsAssigned = true;

            this.assetTypes.forEach((assetType) => {
                assetType.assets.forEach((asset) => {
                    // An asset is considered assigned if it has beneficiaries and remaining share is 0
                    if (
                        !asset.beneficiaries ||
                        asset.beneficiaries.length === 0 ||
                        (asset.remainingShare !== undefined &&
                            asset.remainingShare > 0)
                    ) {
                        allAssetsAssigned = false;
                    }
                });
            });

            isValid = allAssetsAssigned;
        }

        this.setFormValidity.emit(isValid);
    }

    // Form submission
    onSubmit(): void {
        const updatedData: EstateDistributionData = {
            sharingAsAWhole: this.sharingAsAWhole,
            exclusions: this.data.exclusions || [],
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

    // Add a helper method to get beneficiary by ID:
    getBeneficiaryById(id: string): BeneficiaryShare | undefined {
        return this.beneficiaryList.find((b) => b.id === id);
    }

    // Add a method to show the assignments for editing
    showAssetAssignments(asset: Asset): void {
        asset.showAssignments = true;
    }
}
