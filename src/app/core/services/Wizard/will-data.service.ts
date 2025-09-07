import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../utils/api.service';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, firstValueFrom, forkJoin, map, type Observable} from 'rxjs';
import type {
    AssetInventoryData,
    BankAccount,
    EstateDistributionData,
    ExecutorAndWitnessData,
    IdentityVerificationData,
    PersonalDetailsData,
    RealEstateProperty,
    WillData,
    BankAccount,
    Exclusion,
    Executor,
    Witness,
} from '../../models/interfaces/will-data.interface';
import {environment} from '../../../../environments/environment';
import {BeneficiaryAssignment} from '../../models/interfaces/asset.interface';

const routes = {
    draftWill: 'api/v1/wills',
    testator: 'api/v1/testators',
    updateTestator: 'api/v1/testators',
    beneficiaries: 'api/v1/beneficiaries',
    updateBeneficiaries: 'api/v1/beneficiaries',
    assets: 'api/v1/assets',
    updateAssets: 'api/v1/assets',
    assetsDistribution: 'api/v1/distributions',
    updateAssetsDistribution: 'api/v1/distributions',
    previewDraftWill: 'api/v1/wills/preview-draft',
    previewActiveWill: 'api/v1/wills/download',
    createSchedule: 'api/v1/schedules',
    createCodicil: 'api/v1/wills/codicil'
    createSchedule: 'api/v1/schedules'
    exclusions: 'api/v1/exclusions',
    updateExclusions: 'api/v1/exclusions',
    executors: 'api/v1/executors',
    updateExecutors: 'api/v1/executors',
    witnesses: 'api/v1/witnesses',
    updateWitnesses: 'api/v1/witnesses',
    previewWill: 'api/v1/wills/preview-draft',
}

@Injectable({
    providedIn: 'root',
})
export class WillDataService {
         private baseURL = environment.API_URL;
      private apiService = inject(ApiService);
    constructor() {}

    private initialPersonalDetails: PersonalDetailsData = {
        title: '',
        firstName: '',
        lastName: '',
        otherNames: '',
        hasUsedOtherNames: false,
        otherFullName: '',
        dateOfBirth: '',
        stateOfOrigin: '',
        // Address fields
        streetAddress: '',
        city: '',
        state: '',
        country: 'nigeria',
        // Marital status and family
        isMarried: false,
        spouses: [],
        hasChildren: false,
        children: [],
        beneficiaries: [],
    };

    private initialAssetInventory: AssetInventoryData = {
        realEstateProperties: [],
        bankAccounts: [],
        completedAssetTypes: [],
    };

    private initialExecutorAndWitness: ExecutorAndWitnessData = {
        executors: [],
        hasExecutor: false,
        witnesses: [],
        hasWitnesses: false,
    };

    private identityVerificationData!: IdentityVerificationData;

    private initialEstateDistribution: EstateDistributionData = {
        sharingAsAWhole: true,
        exclusions: [], // Added this property to match the updated interface
    };

    private willDataSubject = new BehaviorSubject<WillData>({
        personalDetails: this.initialPersonalDetails,
        assetInventory: this.initialAssetInventory,
        executorAndWitness: this.initialExecutorAndWitness,
        estateDistribution: this.initialEstateDistribution,
    });

    willData$: Observable<WillData> = this.willDataSubject.asObservable();

    updatePersonalDetails(data: Partial<PersonalDetailsData>): void {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            personalDetails: {
                ...currentData.personalDetails,
                ...data,
            },
        });
    }

    updateAssetInventory(data: Partial<AssetInventoryData>): void {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            assetInventory: {
                ...currentData.assetInventory,
                ...data,
            },
        });
    }

    updateExecutorAndWitness(data: Partial<ExecutorAndWitnessData>): void {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            executorAndWitness: {
                ...currentData.executorAndWitness,
                ...data,
            },
        });
    }

    updateEstateDistribution(data: Partial<EstateDistributionData>): void {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            estateDistribution: {
                ...currentData.estateDistribution,
                ...data,
            },
        });
    }

    getWillData(): WillData {
        return this.willDataSubject.value;
    }

    getPersonalDetails(): PersonalDetailsData {
        return this.willDataSubject.value.personalDetails;
    }

    getAssetInventory(): AssetInventoryData {
        return this.willDataSubject.value.assetInventory;
    }

    getExecutorAndWitness(): ExecutorAndWitnessData {
        return this.willDataSubject.value.executorAndWitness;
    }

    getEstateDistribution(): EstateDistributionData {
        return this.willDataSubject.value.estateDistribution;
    }

    saveWillData(): void {
        // In a real app, this would save to a backend
        console.log('Saving will data:', this.willDataSubject.value);
        alert('Your will has been saved successfully!');
    }


    // added this to save schedule
    private scheduleInfo: { date: string; time: string } | null = null;

    saveScheduleInfo(data: { date: string; time: string }): void {
        this.scheduleInfo = data;
    }

    getScheduleInfo(): { date: string; time: string } | null {
        return this.scheduleInfo;
    }

      saveIdentityVerification(data: IdentityVerificationData): void {
    this.identityVerificationData = data;
  }

  getIdentityVerification(): IdentityVerificationData | null {
    return this.identityVerificationData || null;
  }

    async draftWill(): Promise<any> {
    return await firstValueFrom(
        this.apiService.post<any>(this.baseURL + routes.draftWill).pipe(
            tap((response: any) => {
                // console.log('Draft will created successfully:', response);
            })
        )
    );
}

    async createCodicil(): Promise<any> {
        return await firstValueFrom(
            this.apiService.post<any>(this.baseURL + routes.createCodicil).pipe(
                tap((response: any) => {
                    // console.log('Draft will created successfully:', response);
                })
            )
        );
    }

    submitTestatorProfile(data: Partial<PersonalDetailsData>) {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            personalDetails: {
                ...currentData.personalDetails,
                ...data,
            },
        });

        const updatedPersonalDetails = this.createPersonalDetailsPayload(data)
        this.apiService
            .post<any>(this.baseURL + routes.updateTestator, updatedPersonalDetails)
            .pipe()
            .subscribe();
    }


    submitBeneficiaries(data: Partial<PersonalDetailsData>) {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            personalDetails: {
                ...currentData.personalDetails,
                ...data,
            },
        });

        const updatedBeneficiaries = this.createBeneficiariesPayload(data);
        this.apiService
            .post<any>(this.baseURL + routes.updateBeneficiaries, updatedBeneficiaries)
            .pipe(
                tap((beneficiaries: any[]) => {
                    beneficiaries.forEach(beneficiary => {
                        if (beneficiary.relationship === 'OTHER') {
                            beneficiary.relationship = beneficiary.otherRelationship;
                            }
                        });
                    const b = this.extractBeneficiaries(beneficiaries)
                    this.updatePersonalDetails({
                        beneficiaries: b.beneficiaries,
                        children: b.children,
                        spouses: b.spouses,
                        hasChildren: b.children.length > 0,
                        isMarried: b.spouses.length > 0,
                    });
                })
            ).subscribe();
    }

    async submitAssetInventory(data: Partial<AssetInventoryData>): Promise<any> {
        const currentData = this.willDataSubject.value;
        this.willDataSubject.next({
            ...currentData,
            assetInventory: {
                ...currentData.assetInventory,
                ...data,
            },
        });

        const updatedAssets = this.createAssetPayload(data);
        return await firstValueFrom(this.apiService.post<any>(this.baseURL + routes.updateAssets, updatedAssets)
            .pipe(
                tap((assets) => {
                const { realEstateProperties, bankAccounts } = this.extractAssets(assets);

                this.updateAssetInventory({
                    realEstateProperties,
                    bankAccounts
                });

                    console.log(this.willDataSubject.value.assetInventory);


                }),
                map(() => this.willDataSubject.value.assetInventory
                )
            ));

    }

    async submitEstateDistribution() {
        const distribution = this.willDataSubject.value.estateDistribution;
        const distributionPayload: any = {
            type: distribution.sharingAsAWhole ? 'WHOLE' : 'INDIVIDUAL',
            wholeDistributionDetails: [],
            individualDistributionDetails: []
        }
        if(distribution.sharingAsAWhole){
            const beneficiaries = distribution.beneficiaryShares || {};
            distributionPayload.wholeDistributionDetails = Object.keys(beneficiaries || {}).map(beneficiaryId => (
                {
                    beneficiaryId: beneficiaryId,
                    percentage: beneficiaries[beneficiaryId]
                }))

        } else {
            const beneficiaries = distribution.individualAssetAssignments || {};
            const assetIdToType: any = this.getAssetIdToTypeMap();
            distributionPayload.individualDistributionDetails = Object.keys(beneficiaries || {}).map(assetId =>{
                return {
                    assetId: assetId,
                    assetType: assetIdToType[assetId].type,
                    distributionDetails: beneficiaries[assetId]
                }
            })
        }
        await firstValueFrom(this.apiService.post<any>(this.baseURL + routes.updateAssetsDistribution, distributionPayload)
            .pipe());
        // return new Promise<void>((resolve) => {
        //     this.apiService.post<any>(this.baseURL + routes.updateAssetsDistribution, distributionPayload)
        //     .pipe()
        //     .subscribe(() => {
        //         resolve();
        //     });
        // });
    }

    async submitExclusions() {
        await firstValueFrom(this.apiService.post<any>(this.baseURL + routes.updateExclusions, {
            exclusions: this.willDataSubject.value.estateDistribution.exclusions,
            deletedIds: this.willDataSubject.value.estateDistribution.deletedExclusions
        })
        .pipe(tap((response: any) => {
            this.updateEstateDistribution({
                exclusions: response || [],
            });
        })));
        // .subscribe();

    }

    async submitExecutors() {
        const executors = this.willDataSubject.value.executorAndWitness.executors.map((exec) => {
            const executor: any = {
                ...exec
            }
            if (exec.type === 'INDIVIDUAL') {
                executor.name = `${exec.firstName} ${exec.lastName}`;
            } else {
                executor.name = exec.firstName;
            }
            return executor;
        });
        await firstValueFrom(this.apiService.post<any>(this.baseURL + routes.updateExecutors, {
            executors,
            deletedIds: this.willDataSubject.value.executorAndWitness.deletedExecutors
        })
        .pipe(tap((data: any) => {
            const executors: Executor[] = data.map((exec: any) => {
                        const executor: Executor = {
                            ...exec
                        }

                        executor.firstName = exec.name.split(' ')[0];
                        if(executor.type === 'INDIVIDUAL') {
                            executor.lastName = exec.name.split(' ')[1];
                        }
                        return executor;
                    });

            this.updateExecutorAndWitness({
                executors: executors || [],
                hasExecutor: executors.length > 0,
            });

        })));
    }

    async submitWitnesses() {
        await firstValueFrom(this.apiService.post<any>(this.baseURL + routes.updateWitnesses, {
            witnesses: this.willDataSubject.value.executorAndWitness.witnesses,
            deletedIds: this.willDataSubject.value.executorAndWitness.deletedWitnesses
        })
        .pipe(tap((response: any) => {
            this.updateExecutorAndWitness({
                witnesses: response || [],
                hasWitnesses: response.length > 0,
            });
        })));
    }

    createSchedule(schedule: any): Observable<any>    {
        return this.apiService
        .post<any>(this.baseURL + routes.createSchedule, schedule)
    }

    previewDraftWill() {
        return this.apiService.getPreview<any>(this.baseURL + routes.previewDraftWill)
    }

    previewActiveWill() {
        return this.apiService.getPreview<any>(this.baseURL + routes.previewActiveWill)
    }

    getPersonalDetailsFromBE(): Observable<PersonalDetailsData> {
        return forkJoin({
            beneficiaries: this.getBeneficiaries(),
            testator: this.getTestator()
        }).pipe(
            tap(({ beneficiaries, testator }: any) => {
                this.updatePersonalDetails({
                    hasChildren: beneficiaries.children.length > 0,
                    isMarried: beneficiaries.spouses.length > 0,
                    spouses: beneficiaries.spouses,
                    children: beneficiaries.children,
                    beneficiaries: beneficiaries.beneficiaries,
                    ...testator
                });
            }),
            map(() => this.willDataSubject.value.personalDetails)
        );
    }

    getAssetInventoryFromBE(): Observable<AssetInventoryData> {
        return this.apiService.get<any>(this.baseURL + routes.assets)
        .pipe(
            tap((data: any[]) => {
                const { realEstateProperties, bankAccounts } = this.extractAssets(data);

                this.updateAssetInventory({
                    realEstateProperties,
                    bankAccounts
                });
            }),
            map(() => this.willDataSubject.value.assetInventory)
        );
    }

    getAssetDistribution(): Observable<EstateDistributionData> {
        let isSharingAsAWhole = true;
        const beneficiaryShares: { [key: string]: number } = {};
        const individualAssetAssignments: { [assetId: string]: BeneficiaryAssignment[] } = {};

        return this.apiService.get<any>(this.baseURL + routes.assetsDistribution)
            .pipe(
                tap((data: any[]) => {
                    if ("WHOLE" == data[0]?.type) {
                        isSharingAsAWhole = true;
                        data[0].distributionDetails.forEach((detail: any) => {
                            beneficiaryShares[detail.beneficiary.id] = detail.percentage;
                        });
                    } else if ("INDIVIDUAL" == data[0]?.type) {
                        isSharingAsAWhole = false;
                        data.forEach((distribution: any) => {
                            distribution.individualAssetDistributions.forEach((distribution: any) => {
                                individualAssetAssignments[distribution.asset.id] =  distribution.distributionDetails.map((b: any) => ({
                                            beneficiaryId: b.beneficiary.id,
                                            percentage: b.percentage
                                        }))

                            })
                        })
                    }

                    this.updateEstateDistribution({
                        sharingAsAWhole: isSharingAsAWhole,
                        beneficiaryShares: beneficiaryShares,
                        individualAssetAssignments: individualAssetAssignments
                    })

                }),
            map(() => this.willDataSubject.value.estateDistribution)
            );
    }

    getAssetInventoryForDistribution(): Observable<any> {
        return this.apiService.get<any>(this.baseURL + routes.assets)
        .pipe(
            tap((data: any[]) => {

            }),
            // map((data) => this.willDataSubject.value.estateDistribution.assets || [])
        );
    }

    getBeneficiaries(): any {
        return this.apiService.get<any>(this.baseURL + routes.beneficiaries)
        .pipe(
            map((data: any[]) => {
                return this.extractBeneficiaries(data);
            })
        );
    }

    getExclusions(): Observable<Exclusion[]> {
        return this.apiService.get<any>(this.baseURL + routes.exclusions)
        .pipe(
            map((data: any[]) => {
                return data;
            })
        );
    }

    getExecutors(): Observable<Executor[]> {
        return this.apiService.get<any>(this.baseURL + routes.executors)
            .pipe(
                tap((data: any[]) => {
                    const executors: Executor[] = data.map((exec: any) => {
                        const executor: Executor = {
                            ...exec
                        }

                        executor.firstName = exec.name.split(' ')[0];
                        if(executor.type === 'INDIVIDUAL') {
                            executor.lastName = exec.name.split(' ')[1];
                        }
                        return executor;
                    });

                    this.updateExecutorAndWitness({
                        executors,
                        hasExecutor: executors.length > 0
                    })

                }),
            map(() => this.willDataSubject.value.executorAndWitness.executors || [])
            );
    }

    getWitnesses(): Observable<Witness[]> {
        return this.apiService.get<any>(this.baseURL + routes.witnesses)
            .pipe(
                tap((data: any[]) => {
                    const witnesses: Witness[] = data.map((witness: any) =>
                    ({
                        ...witness
                    })
                );
                    this.updateExecutorAndWitness({
                        witnesses,
                        hasWitnesses: witnesses.length > 0
                    })

                }),
            map(() => this.willDataSubject.value.executorAndWitness.witnesses || [])
            );
    }

    getTestator(): any {
        return this.apiService.get<any>(this.baseURL + routes.testator)
        .pipe(
            map((data: any) => {
                let address = {};
                if(data.address) {
                    address = {
                        streetAddress: data.address.primaryHomeAddress || '',
                        city: data.address.city || '',
                        state: data.address.state || '',
                        country: data.address.country || 'nigeria',
                    }
                }

                return {
                    ...data,
                    ...address,
                    hasUsedOtherNames: (data.preferredName != null && data.preferredName != "") || false,
                    otherFullName: data.preferredName || '',
                };
            }));
    }

    extractBeneficiaries(data: any[]) {
        const children = data.filter(b => b.relationship === 'CHILD');
        const spouses = data.filter(b => b.relationship === 'SPOUSE');
        const beneficiaries = data.filter(
            b => b.relationship !== 'CHILD' && b.relationship !== 'SPOUSE'
        );
        return { children, spouses, beneficiaries };
    }

    extractAssets(data: any[]) {
        let realEstateProperties: RealEstateProperty[];
        let bankAccounts: BankAccount[];
        if (data.length > 0) {
            realEstateProperties = data.filter(asset => asset.assetType === 'REAL_ESTATE')
                .map(asset => ({
                    id: asset.id,
                    propertyType: asset.propertyType,
                    propertyTitle: asset.propertyTitle,
                    address: asset.address,
                    city: asset.city,
                    state: asset.state,
                    country: asset.country,
                    ownershipType: asset.ownershipType
                }));
            bankAccounts = data.filter(asset => asset.assetType === 'BANK_ACCOUNT')
                .map(asset => ({
                    id: asset.id,
                    accountType: asset.accountType,
                    institution: asset.bankName,
                    accountNumber: asset.accountNumber
                }));
        } else {
            realEstateProperties = [];
            bankAccounts = [];
        }
        return { realEstateProperties, bankAccounts };
    }

    getAssetIdToTypeMap(): { [assetId: string]: string } {
    const assetTypes = this.willDataSubject.value.estateDistribution.assets || [];
        const assetIdToType: any= {};
        assetTypes.forEach(assetType => {
            assetType.assets.forEach(asset => {
                assetIdToType[asset.id] = assetType.id;
            });
        });
        return assetIdToType;
    }

    // create BE request payload from the
    createPersonalDetailsPayload(data: Partial<PersonalDetailsData>) {
        return {
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            otherNames: data.otherNames,
            displayName: data.firstName + " " + data.lastName,
            preferredName: data.otherFullName,
            dateOfBirth: data.dateOfBirth,
            stateOfOrigin: data.stateOfOrigin,
            address: {
                primaryHomeAddress: data.streetAddress,
                city: data.city,
                state: data.state,
                country: data.country,
            }
        };
    }

    createBeneficiariesPayload(data: Partial<PersonalDetailsData>) {
        let beneficiaries: any[] = [];
        if (data.children != null && data.children.length > 0) {
            beneficiaries = beneficiaries.concat(data.children.map(child => ({
                ...child,
                relationship: 'CHILD',
            })));
        }

        if (data.spouses != null && data.spouses.length > 0) {
            beneficiaries = beneficiaries.concat(data.spouses.map(spouse => ({
                ...spouse,
                relationship: 'SPOUSE',
            })));
        }

        if (data.beneficiaries != null && data.beneficiaries.length > 0) {
            beneficiaries = beneficiaries.concat(data.beneficiaries.map(beneficiary => ({
                ...beneficiary,
                relationship: 'OTHER',
                otherRelationship: beneficiary.relationship || '',

            })));
        }

        return {
            beneficiaries,
            deletedIds: []
        } ;

    }

    createAssetPayload(data: Partial<AssetInventoryData>) {
        let assets: any[] = [];
        if (data.realEstateProperties && data.realEstateProperties.length > 0) {
            assets = assets.concat(data.realEstateProperties.map(property => {
                return {
                    id: property.id,
                    assetType: 'REAL_ESTATE',
                    propertyType: property.propertyType,
                    propertyTitle: property.propertyTitle,
                    address: property.address,
                    city: property.city,
                    state: property.state,
                    country: property.country,
                    ownershipType: property.ownershipType
                };

            }));
        }
        if (data.bankAccounts && data.bankAccounts.length > 0) {
            assets = assets.concat(data.bankAccounts.map(account => {
                return {
                    id: account.id,
                    assetType: 'BANK_ACCOUNT',
                    accountType: account.accountType,
                    bankName: account.institution,
                    accountNumber: account.accountNumber
                };
            }));
        }

        return {
            assets,
            deletedIds: []
        } ;
    }

}
