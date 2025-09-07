import {CommonModule, DatePipe, Location} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {WillDataService} from '../../../core/services/Wizard/will-data.service';
import {Beneficiary, WillData} from '../../../core/models/interfaces/will-data.interface';
import {firstValueFrom, forkJoin, tap} from 'rxjs';

interface PersonalDetailsData {
    title: string;
    firstName: string;
    lastName: string;
    otherNames: string;
    hasUsedOtherNames: boolean;
    otherFullName: string;
    dateOfBirth: string;
    stateOfOrigin: string;
    gender: string;
    streetAddress: string;
    state: string;
    city: string;
    country: string;
    isMarried: boolean;
    hasChildren: boolean;
    spouses: {
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        dateOfMarriage: string;
    }[];
    children: {
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        email: string;
    }[];
}

interface WillSection {
    id: string;
    title: string;
    description: string;
    stepNumber: number;
    expanded: boolean;
    completed: boolean;
    data?: unknown;
    returningUserTitle?: string;
    returningUserDescription?: string;
}

@Component({
    selector: 'app-will-progress',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        MatDividerModule,
    ],
    providers: [DatePipe],
    templateUrl: './will-progress.component.html',
    styleUrl: './will-progress.component.scss'
})
export class WillProgressComponent implements OnInit {
    @Input() hasStartedWill = true; // Always true for codicil (they already have a will)
    completionPercentage = 0;

    // User data for header display
    userName = 'John Doe';
    userEmail = 'johndoe@gmail.com';
    userAvatarUrl = '/svg/display-pic.svg';

    willSections: WillSection[] = [
        {
            id: 'personal-details',
            title: 'Your Personal Details',
            description:
                'Provide essential information about yourself and your family, and any other beneficiaries.',
            returningUserTitle: 'Personal Details',
            returningUserDescription:
                'Details about you, your immediate family and other beneficiaries.',
            stepNumber: 1,
            expanded: false,
            completed: false,
        },
        {
            id: 'asset-inventory',
            title: 'List your assets',
            description:
                'Outline the full scope of your assets ensuring nothing is overlooked.',
            returningUserTitle: 'My Assets',
            returningUserDescription:
                'All your listed assets including your properties and bank accounts.',
            stepNumber: 2,
            expanded: false,
            completed: false,
        },
        {
            id: 'estate-distribution',
            title: 'Distribute your estate',
            description:
                'Specify how you want your possessions to be divided among your loved ones.',
            returningUserTitle: 'Estate Distribution',
            returningUserDescription:
                'Your estate shared with your loved ones as you wish',
            stepNumber: 3,
            expanded: false,
            completed: false,
        },
        {
            id: 'executor-and-witnesses',
            title: 'Name your Executor & Witnesses',
            description:
                'Designate the individual(s) that will manage and administer your estate according to your wishes',
            returningUserTitle: 'Executor & Witnesses',
            returningUserDescription:
                'Your estate shared with your loved ones as you wish',
            stepNumber: 4,
            expanded: false,
            completed: true,
        },
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private willDataService: WillDataService,
        private datePipe: DatePipe,
        private location: Location
    ) {
    }

    ngOnInit(): void {
        if (this.hasStartedWill) {
            this.checkWillStatus();
        }
    }

    async checkWillStatus(): Promise<void> {

        const dummyWillData = this.getDummyWillData();

        await firstValueFrom(forkJoin({
            personalDetails: this.willDataService.getPersonalDetailsFromBE(),
            assets: this.willDataService.getAssetInventoryFromBE(),
            estateDistribution: this.willDataService.getAssetDistribution(),
        }).pipe(
            tap(({personalDetails, assets, estateDistribution}: any) => {
                dummyWillData.personalDetails = {
                    ...dummyWillData.personalDetails,
                    ...personalDetails
                };
                dummyWillData.assetInventory = {
                    ...dummyWillData.assetInventory,
                    ...assets
                }
                try {
                    // Map beneficiaries
                    const beneficiairies: Beneficiary[] = [];
                    const wholeDistibution: any[] = [];

                    personalDetails.spouses.forEach((element: any) => {
                        beneficiairies.push({
                            id: element.id,
                            type: element.type,
                            firstName: element.firstName,
                            lastName: element.lastName,
                            relationship: element.relationship,
                            dateOfBirth: element.dateOfBirth
                        });
                        element.percentage = estateDistribution.beneficiaryShares[element.id] || 0;
                        wholeDistibution.push(element);
                    });
                    personalDetails.children.forEach((element: any) => {
                        beneficiairies.push({
                            id: element.id,
                            type: element.type,
                            firstName: element.firstName,
                            lastName: element.lastName,
                            relationship: element.relationship,
                            dateOfBirth: element.dateOfBirth
                        });
                        element.percentage = estateDistribution.beneficiaryShares[element.id] || 0;
                        wholeDistibution.push(element);
                    });
                    personalDetails.beneficiaries.forEach((element: any) => {
                        beneficiairies.push({
                            id: element.id,
                            type: element.type,
                            firstName: element.firstName,
                            lastName: element.lastName,
                            relationship: element.relationship,
                            dateOfBirth: element.dateOfBirth
                        });
                        element.percentage = estateDistribution.beneficiaryShares[element.id] || 0;
                        wholeDistibution.push(element);
                    });

                    dummyWillData.estateDistribution = {
                        sharingAsAWhole: estateDistribution.sharingAsAWhole,
                        exclusions: estateDistribution.exclusions,
                        wholeDistibutionShares: wholeDistibution
                    }

                } catch (error) {
                    console.log(error);

                }

            })
        ));

        // Only update sections if user has started will (don't override hasStartedWill)
        if (this.hasStartedWill) {
            this.updateSectionStatus(dummyWillData);
            this.calculateCompletionPercentage();
        }

        // // Update sections with data
        // const personalDetailsSection = this.willSections.find(
        //     (s) => s.id === 'personal-details'
        // );
        // if (personalDetailsSection) {
        //     personalDetailsSection.data = dummyWillData.personalDetails;
        //     personalDetailsSection.completed = true;
        // }

        // const assetsSection = this.willSections.find((s) => s.id === 'asset-inventory');
        // if (assetsSection) {
        //     assetsSection.data = dummyWillData.assets;
        //     assetsSection.completed = true;
        // }

        // const distributionSection = this.willSections.find(
        //     (s) => s.id === 'estate-distribution'
        // );
        // if (distributionSection) {
        //     distributionSection.completed = true;
        // }

        // this.calculateCompletionPercentage();
    }

    getDummyWillData(): any {

        // Use dummy data for now
        const beneficiaries: Beneficiary[] = [];
        return {
            personalDetails: {
                title: 'Mr.',
                firstName: 'John',
                lastName: 'Doe',
                otherNames: '',
                hasUsedOtherNames: false,
                otherFullName: '',
                dateOfBirth: '1985-03-15',
                stateOfOrigin: 'Lagos',
                gender: 'Male',
                streetAddress: '123 Victoria Island',
                state: 'Lagos',
                city: 'Lagos',
                country: 'Nigeria',
                isMarried: true,
                hasChildren: true,
                spouses: [
                    {
                        id: '1',
                        firstName: 'Jane',
                        lastName: 'Doe',
                        dateOfBirth: '1987-08-22',
                        dateOfMarriage: '2010-06-15',
                    },
                ],
                children: [
                    {
                        id: '1',
                        firstName: 'Sarah',
                        lastName: 'Doe',
                        dateOfBirth: '2012-04-10',
                        email: 'sarah.doe@email.com',
                    },
                    {
                        id: '2',
                        firstName: 'Michael',
                        lastName: 'Doe',
                        dateOfBirth: '2015-11-03',
                        email: 'michael.doe@email.com',
                    },
                ],
                beneficiaries: beneficiaries,
            },
            assetInventory: {
                realEstateProperties: [
                    {
                        id: 'prop-1',
                        propertyType: 'Residential',
                        propertyTitle: 'Certificate of Occupancy',
                        address: '123 Oak Street, Springfield',
                        city: 'Springfield',
                        state: 'Illinois',
                        country: 'United States',
                        ownershipType: 'Sole owner',
                    },
                ],
                bankAccounts: [
                    {
                        id: 'bank-1',
                        accountType: 'Checking Account',
                        institution: 'Chase Bank',
                        accountNumber: '1234567890',
                    },
                ],
                completedAssetTypes: ['real-estate', 'bank-account'],
            },
            estateDistribution: {
                sharingAsAWhole: false,
                exclusions: [],
            },
            executorAndWitness: {
                executors: [],
                witnesses: [],
                hasExecutor: false,
                hasWitnesses: false,
            },
        };
    }


    updateSectionStatus(willData: WillData): void {

        // Update personal details status
        const personalDetailsSection = this.willSections.find(
            (s) => s.id === 'personal-details'
        );
        if (personalDetailsSection) {
            personalDetailsSection.completed = !!(
                willData.personalDetails?.firstName &&
                willData.personalDetails?.lastName
            );
            personalDetailsSection.data = willData.personalDetails;
        }

        // Update assets status
        const assetsSection = this.willSections.find((s) => s.id === 'asset-inventory');
        if (assetsSection) {
            assetsSection.completed =
                willData.assetInventory &&
                (willData.assetInventory.realEstateProperties.length > 0 ||
                    willData.assetInventory.bankAccounts.length > 0);
            assetsSection.data = willData.assetInventory;
        }

        // Update distribution status
        const distributionSection = this.willSections.find(
            (s) => s.id === 'estate-distribution'
        );

        if (distributionSection) {
            distributionSection.completed =
                willData.estateDistribution &&
                !!(
                    willData.estateDistribution.beneficiaryShares ||
                    willData.estateDistribution.individualAssetAssignments
                );
            distributionSection.data = willData.estateDistribution;
        }

        // Update executor status
        const executorSection = this.willSections.find(
            (s) => s.id === 'executor-and-witnesses'
        );
        if (executorSection) {
            executorSection.completed =
                willData.executorAndWitness &&
                (willData.executorAndWitness.executors.length > 0 ||
                    willData.executorAndWitness.witnesses.length > 0);
            executorSection.data = willData.executorAndWitness;
        }
    }

    toggleSection(sectionId: string): void {
        const section = this.willSections.find((s) => s.id === sectionId);
        if (section) {
            const wasExpanded = section.expanded;

            // Close all sections first
            this.willSections.forEach((s) => {
                s.expanded = false;
            });

            // If the section wasn't expanded before, expand it now
            if (!wasExpanded) {
                section.expanded = true;
            }
        }
    }

    getPersonalDetailsData(section: WillSection): PersonalDetailsData | null {
        if (section.id === 'personal-details' && section.data) {
            return section.data as PersonalDetailsData;
        }
        return null;
    }

    navigateToSection(sectionId: string): void {
        // Navigate to the specific section
        this.router.navigate([`/wiz/will/${sectionId}`]);
    }

    getProgressWidth(sectionId: string): string {
        const section = this.willSections.find((s) => s.id === sectionId);
        if (section?.completed) {
            return '100%';
        }
        return '0%';
    }

    calculateCompletionPercentage(): void {
        const completedSections = this.willSections.filter(
            (s) => s.completed
        ).length;
        this.completionPercentage = Math.round(
            (completedSections / this.willSections.length) * 100
        );
    }

    // onUpdateSection(sectionId: string): void {
    //     switch (sectionId) {
    //         case 'personal-details':
    //             this.router.navigate(['/wiz/will/personal-details']);
    //             break;
    //         case 'asset-inventory':
    //             this.router.navigate(['/wiz/will/asset-inventory']);
    //             break;
    //         case 'estate-distribution':
    //             this.router.navigate(['/wiz/will/estate-distribution']);
    //             break;
    //         case 'executor-and-witnesses':
    //             this.router.navigate(['/wiz/will/executor-and-witnesses']);
    //             break;
    //         default:
    //             // Optional: navigate to a default or show an error
    //             break;
    //     }
    // }

    getProgressPreview(sectionId: string): string {
        const section = this.willSections.find((s) => s.id === sectionId);
        if (!section || !section.data) return 'No data yet';

        switch (sectionId) {
            case 'personal-details': {
                const data = section.data as {
                    firstName?: string;
                    lastName?: string;
                };
                return (
                    `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
                    'Personal information started'
                );
            }
            case 'asset-inventory': {
                const data = section.data as {
                    realEstateProperties: unknown[];
                    bankAccounts: unknown[];
                };
                const totalAssets =
                    data.realEstateProperties.length + data.bankAccounts.length;
                return `${totalAssets} asset(s) added`;
            }
            case 'estate-distribution': {
                const data = section.data as {
                    beneficiaryShares?: Record<string, number>;
                    individualAssetAssignments?: Record<string, string>;
                };
                const shareCount = data.beneficiaryShares
                    ? Object.keys(data.beneficiaryShares).length
                    : 0;
                const assignmentCount = data.individualAssetAssignments
                    ? Object.keys(data.individualAssetAssignments).length
                    : 0;
                return shareCount > 0 || assignmentCount > 0
                    ? 'Distribution configured'
                    : 'Distribution started';
            }
            case 'executor-and-witnesses': {
                const data = section.data as {
                    executors?: unknown[];
                    witnesses?: unknown[];
                };
                const executors = data.executors?.length || 0;
                const witnesses = data.witnesses?.length || 0;
                return `${executors} executor(s), ${witnesses} witness(es)`;
            }
            default:
                return 'Information available';
        }
    }
}
