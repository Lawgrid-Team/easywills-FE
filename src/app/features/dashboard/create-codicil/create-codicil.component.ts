import {AccountService} from './../../../core/services/Wizard/account.service';
import {WillStateService} from './../../../shared/services/will-state.service';
import {Component, type OnInit} from '@angular/core';
import {CommonModule, DatePipe, Location} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterModule} from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import {WillProgressComponent} from "../../wizard/will-progress/will-progress.component";
import {HeaderComponent} from "../../wizard/widget/header/header.component";

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
    data?: PersonalDetailsData | Record<string, unknown>;
    returningUserTitle?: string;
    returningUserDescription?: string;
}

@Component({
    selector: 'app-create-codicil',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        MatDividerModule,
        WillProgressComponent,
        HeaderComponent
    ],
    providers: [DatePipe],
    templateUrl: './create-codicil.component.html',
    styleUrl: './create-codicil.component.scss',
})
export class CreateCodicilComponent implements OnInit {
    hasStartedWill = true; // Always true for codicil (they already have a will)
    completionPercentage = 0;

    // User data for header display
    user = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        avatar: '/svg/display-pic.svg'
    }
    defaultAvatar = '/svg/display-pic.svg';
    willState: any = {};
    amendedSection: string[] = [];

    // willSections: WillSection[] = [
    //     {
    //         id: 'personal-details',
    //         title: 'Your Personal Details',
    //         description:
    //             'Provide essential information about yourself and your family, and any other beneficiaries.',
    //         returningUserTitle: 'Personal Details',
    //         returningUserDescription:
    //             'Details about you, your immediate family and other beneficiaries.',
    //         stepNumber: 1,
    //         expanded: false,
    //         completed: false,
    //     },
    //     {
    //         id: 'assets',
    //         title: 'List your assets',
    //         description:
    //             'Outline the full scope of your assets ensuring nothing is overlooked.',
    //         returningUserTitle: 'My Assets',
    //         returningUserDescription:
    //             'All your listed assets including your properties and bank accounts.',
    //         stepNumber: 2,
    //         expanded: false,
    //         completed: false,
    //     },
    //     {
    //         id: 'distribution',
    //         title: 'Distribute your estate',
    //         description:
    //             'Specify how you want your possessions to be divided among your loved ones.',
    //         returningUserTitle: 'Estate Distribution',
    //         returningUserDescription:
    //             'Your estate shared with your loved ones as you wish',
    //         stepNumber: 3,
    //         expanded: false,
    //         completed: false,
    //     },
    //     {
    //         id: 'executor',
    //         title: 'Name your Executor & Witnesses',
    //         description:
    //             'Designate the individual(s) that will manage and administer your estate according to your wishes',
    //         returningUserTitle: 'Executor & Witnesses',
    //         returningUserDescription:
    //             'Your estate shared with your loved ones as you wish',
    //         stepNumber: 4,
    //         expanded: false,
    //         completed: true,
    //     },
    // ];

    constructor(
        private router: Router,
        private willStateService: WillStateService,
        private accountService: AccountService,
        private datePipe: DatePipe,
        private location: Location
    ) {}

    ngOnInit(): void {
        // Always show as returning user since they're creating a codicil
        // this.checkWillStatus();

        this.accountService.getUserProfile();
        this.willStateService.getWillState();

        this.accountService.userData$.subscribe({
            next: (value) => {
                if (value) {
                    this.user = value;
                    if (!this.user.avatar || this.user.avatar === '') {
                        this.user.avatar = this.defaultAvatar
                    }
                }
            }
        })

        this.willStateService.willState$.subscribe({
            next: (willState) => {
                if (willState) {
                    this.willState = willState;
                    this.updateAmendedSection()
                }
            }
        })
    }


    updateAmendedSection() {
        this.amendedSection = [];
        this.willState.stages.forEach((stage: any) => {

            if (stage === 'PROFILE') {
                this.amendedSection.push("Update Profile")
            } else if (stage === 'BENEFICIARIES') {
                this.amendedSection.push("Add new Beneficiary")
            } else if (stage === 'ASSETS') {
                this.amendedSection.push("Add new Asset")
            } else if (stage === 'DISTRIBUTION') {
                this.amendedSection.push("Update Asset Distribution")
            } else if (stage === 'EXCLUSIONS') {
                this.amendedSection.push("Add new Exclusion")
            } else if (stage === 'EXECUTORS') {
                this.amendedSection.push("Add new Executor")
            } else if (stage === 'WITNESSES') {
                this.amendedSection.push("Add new Witness")
            }
        });
    }

    //TODO:: delete, this has been moved to WillProgressComponent
    // checkWillStatus(): void {
    //     // Use dummy data for now - you can update this later
    //     const dummyWillData = {
    //         personalDetails: {
    //             title: 'Mr.',
    //             firstName: 'John',
    //             lastName: 'Doe',
    //             otherNames: '',
    //             hasUsedOtherNames: false,
    //             otherFullName: '',
    //             dateOfBirth: '1985-03-15',
    //             stateOfOrigin: 'Lagos',
    //             gender: 'Male',
    //             streetAddress: '123 Victoria Island',
    //             state: 'Lagos',
    //             city: 'Lagos',
    //             country: 'Nigeria',
    //             isMarried: true,
    //             hasChildren: true,
    //             spouses: [
    //                 {
    //                     id: '1',
    //                     firstName: 'Jane',
    //                     lastName: 'Doe',
    //                     dateOfBirth: '1987-08-22',
    //                     dateOfMarriage: '2010-06-15',
    //                 },
    //             ],
    //             children: [
    //                 {
    //                     id: '1',
    //                     firstName: 'Sarah',
    //                     lastName: 'Doe',
    //                     dateOfBirth: '2012-04-10',
    //                     email: 'sarah.doe@email.com',
    //                 },
    //             ],
    //         },
    //         assets: {
    //             realEstateProperties: [
    //                 {
    //                     propertyType: 'Residential Property',
    //                     ownershipType: 'Sole Ownership',
    //                     address: '456 Lekki Phase 1',
    //                     city: 'Lagos',
    //                     state: 'Lagos',
    //                 },
    //             ],
    //             bankAccounts: [
    //                 {
    //                     institution: 'First Bank of Nigeria',
    //                     accountNumber: '1234567890',
    //                     accountType: 'Savings Account',
    //                 },
    //             ],
    //         },
    //     };

    //     // Update sections with data
    //     const personalDetailsSection = this.willSections.find(
    //         (s) => s.id === 'personal-details'
    //     );
    //     if (personalDetailsSection) {
    //         personalDetailsSection.data = dummyWillData.personalDetails;
    //         personalDetailsSection.completed = true;
    //     }

    //     const assetsSection = this.willSections.find((s) => s.id === 'assets');
    //     if (assetsSection) {
    //         assetsSection.data = dummyWillData.assets;
    //         assetsSection.completed = true;
    //     }

    //     const distributionSection = this.willSections.find(
    //         (s) => s.id === 'distribution'
    //     );
    //     if (distributionSection) {
    //         distributionSection.completed = true;
    //     }

    //     this.calculateCompletionPercentage();
    // }

    // toggleSection(sectionId: string): void {
    //     const section = this.willSections.find((s) => s.id === sectionId);
    //     if (section) {
    //         const wasExpanded = section.expanded;

    //         // Close all sections first
    //         this.willSections.forEach((s) => {
    //             s.expanded = false;
    //         });

    //         // If the section wasn't expanded before, expand it now
    //         if (!wasExpanded) {
    //             section.expanded = true;
    //         }
    //     }
    // }

    // getPersonalDetailsData(section: WillSection): PersonalDetailsData | null {
    //     if (section.id === 'personal-details' && section.data) {
    //         return section.data as PersonalDetailsData;
    //     }
    //     return null;
    // }

    // navigateToSection(sectionId: string): void {
    //     // Navigate to the specific section
    //     this.router.navigate([`/wiz/will/${sectionId}`]);
    // }

    // getProgressWidth(sectionId: string): string {
    //     const section = this.willSections.find((s) => s.id === sectionId);
    //     if (section?.completed) {
    //         return '100%';
    //     }
    //     return '0%';
    // }

    // calculateCompletionPercentage(): void {
    //     const completedSections = this.willSections.filter(
    //         (s) => s.completed
    //     ).length;
    //     this.completionPercentage = Math.round(
    //         (completedSections / this.willSections.length) * 100
    //     );
    // }

    // continueWill(): void {
    //     // Find the first incomplete section and navigate to it
    //     const nextSection = this.willSections.find((s) => !s.completed);
    //     if (nextSection) {
    //         this.navigateToSection(nextSection.id);
    //     } else {
    //         // All sections complete, go to review
    //         this.router.navigate(['/wiz/will/review-and-download']);
    //     }
    // }

    startOver(): void {
        // Navigate to start of wizard
        this.router.navigate(['/wiz/welcome']);
    }

    goBack(): void {
        this.location.back();
    }
}

