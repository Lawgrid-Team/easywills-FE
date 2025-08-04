import { Component, type OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { WillData } from '../../../core/models/interfaces/will-data.interface';
import { MatDividerModule } from '@angular/material/divider';

interface WillSection {
    id: string;
    title: string;
    description: string;
    stepNumber: number;
    expanded: boolean;
    completed: boolean;
    data?: unknown;
    // Properties for returning users
    returningUserTitle?: string;
    returningUserDescription?: string;
}

@Component({
    selector: 'app-welcome',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        MatDividerModule,
    ],
    providers: [DatePipe],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
    hasStartedWill = false;
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
            id: 'assets',
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
            id: 'distribution',
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
            id: 'executor',
            title: 'Name your Executor & Witnesses',
            description:
                'Designate the individual(s) that will manage and administer your estate according to your wishes',
            returningUserTitle: 'Executor & Witnesses',
            returningUserDescription:
                'Your estate shared with your loved ones as you wish',
            stepNumber: 4,
            expanded: false,
            completed: false,
        },
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private willDataService: WillDataService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params['continue'] === 'true') {
                this.hasStartedWill = true;
                this.checkWillStatus();
            } else {
                this.hasStartedWill = false;
            }
        });
    }

    checkWillStatus(): void {
        // Use dummy data for now
        const dummyWillData = {
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
                beneficiaries: [],
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

        // Only update sections if user has started will (don't override hasStartedWill)
        if (this.hasStartedWill) {
            this.updateSectionStatus(dummyWillData);
            this.calculateCompletionPercentage();
        }
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
        const assetsSection = this.willSections.find((s) => s.id === 'assets');
        if (assetsSection) {
            assetsSection.completed =
                willData.assetInventory &&
                (willData.assetInventory.realEstateProperties.length > 0 ||
                    willData.assetInventory.bankAccounts.length > 0);
            assetsSection.data = willData.assetInventory;
        }

        // Update distribution status
        const distributionSection = this.willSections.find(
            (s) => s.id === 'distribution'
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
            (s) => s.id === 'executor'
        );
        if (executorSection) {
            executorSection.completed =
                willData.executorAndWitness &&
                (willData.executorAndWitness.executors.length > 0 ||
                    willData.executorAndWitness.witnesses.length > 0);
            executorSection.data = willData.executorAndWitness;
        }
    }

    calculateCompletionPercentage(): void {
        const completedSections = this.willSections.filter(
            (section) => section.completed
        ).length;
        this.completionPercentage = Math.round(
            (completedSections / this.willSections.length) * 100
        );
    }

    toggleSection(sectionId: string): void {
        const section = this.willSections.find((s) => s.id === sectionId);
        if (section) {
            const wasExpanded = section.expanded;

            // First, collapse all sections
            this.willSections.forEach((s) => {
                s.expanded = false;
            });

            // Then expand the clicked section only if it wasn't already expanded
            if (!wasExpanded) {
                section.expanded = true;
            }
        }
    }

    getStatusClass(sectionId: string): string {
        const section = this.willSections.find((s) => s.id === sectionId);
        if (!section) return '';

        if (section.completed) {
            return 'bg-green-100 text-green-800';
        } else if (
            section.data &&
            typeof section.data === 'object' &&
            section.data !== null &&
            Object.keys(section.data).length > 0
        ) {
            return 'bg-yellow-100 text-yellow-800';
        } else {
            return 'bg-gray-100 text-gray-600';
        }
    }

    getStatusText(sectionId: string): string {
        const section = this.willSections.find((s) => s.id === sectionId);
        if (!section) return '';

        if (section.completed) {
            return 'Completed';
        } else if (
            section.data &&
            typeof section.data === 'object' &&
            section.data !== null &&
            Object.keys(section.data).length > 0
        ) {
            return 'In Progress';
        } else {
            return 'Not Started';
        }
    }

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
            case 'assets': {
                const data = section.data as {
                    realEstateProperties: unknown[];
                    bankAccounts: unknown[];
                };
                const totalAssets =
                    data.realEstateProperties.length + data.bankAccounts.length;
                return `${totalAssets} asset(s) added`;
            }
            case 'distribution': {
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
            case 'executor': {
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

    onUpdateSection(sectionId: string): void {
        switch (sectionId) {
            case 'personal-details':
                this.router.navigate(['/wiz/will/personal-details']);
                break;
            case 'assets':
                this.router.navigate(['/wiz/will/asset-inventory']);
                break;
            case 'distribution':
                this.router.navigate(['/wiz/will/estate-distribution']);
                break;
            case 'executor':
                this.router.navigate(['/wiz/will/executor-and-witnesses']);
                break;
            default:
                // Optional: navigate to a default or show an error
                break;
        }
    }

    async onGetStarted(): Promise<void> {
        if(!this.hasStartedWill) {
            await this.willDataService.draftWill()
        }
        // Navigate to the first step of the wizard
        this.router.navigate(['/wiz/will/personal-details']);
    }

    onContinueWill(): void {
        // Find the first incomplete section and navigate there
        const firstIncomplete = this.willSections.find(
            (section) => !section.completed
        );

        if (firstIncomplete) {
            switch (firstIncomplete.id) {
                case 'personal-details':
                    this.router.navigate(['/wiz/will/personal-details']);
                    break;
                case 'assets':
                    this.router.navigate(['/wiz/will/asset-inventory']);
                    break;
                case 'distribution':
                    this.router.navigate(['/wiz/will/estate-distribution']);
                    break;
                case 'executor':
                    this.router.navigate(['/wiz/will/executor-and-witnesses']);
                    break;
                default:
                    this.router.navigate(['/wiz/will/personal-details']);
            }
        } else {
            // All sections complete, go to review or first step if no review exists
            this.router.navigate(['/wiz/will/personal-details']);
        }
    }

    getProgressWidth(sectionId: string): string {
        switch (sectionId) {
            case 'personal-details':
                return '100%';
            case 'assets':
                return '100%';
            case 'distribution':
                return '10%';
            case 'executor':
                return '0%';
            default:
                return '0%';
        }
    }

    goBack(): void {
        // Navigate back to dashboard or previous page
        this.router.navigate(['/dashboard']);
    }
}
