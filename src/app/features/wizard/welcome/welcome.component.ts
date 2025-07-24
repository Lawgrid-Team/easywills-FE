import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import type { WillData } from '../../../core/models/interfaces/will-data.interface';

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
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
    hasStartedWill = false;
    completionPercentage = 0;

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
        this.checkWillStatus();
        this.route.queryParams.subscribe((params) => {
            if (params['continue'] === 'true') {
                this.hasStartedWill = true;
            }
        });
    }

    checkWillStatus(): void {
        // Check if user has started a will by looking at will data
        const willData = this.willDataService.getWillData();

        const hasPersonalDetails =
            willData.personalDetails &&
            (willData.personalDetails.firstName ||
                willData.personalDetails.lastName);
        const hasAssets =
            willData.assetInventory &&
            (willData.assetInventory.realEstateProperties.length > 0 ||
                willData.assetInventory.bankAccounts.length > 0);
        const hasDistribution =
            willData.estateDistribution &&
            !!(
                willData.estateDistribution.beneficiaryShares ||
                willData.estateDistribution.individualAssetAssignments
            );
        const hasExecutor =
            willData.executorAndWitness &&
            (willData.executorAndWitness.executors.length > 0 ||
                willData.executorAndWitness.witnesses.length > 0);

        this.hasStartedWill = !!(
            hasPersonalDetails ||
            hasAssets ||
            hasDistribution ||
            hasExecutor
        );

        if (this.hasStartedWill) {
            this.updateSectionStatus(willData);
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
            section.expanded = !section.expanded;
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

    onGetStarted(): void {
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
}
