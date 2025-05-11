import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable } from 'rxjs';
import type {
    WillData,
    PersonalDetailsData,
    AssetInventoryData,
    EstateDistributionData,
} from '../../models/interfaces/will-data.interface';

@Injectable({
    providedIn: 'root',
})
export class WillDataService {
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

    private initialEstateDistribution: EstateDistributionData = {
        sharingAsAWhole: true,
    };

    private willDataSubject = new BehaviorSubject<WillData>({
        personalDetails: this.initialPersonalDetails,
        assetInventory: this.initialAssetInventory,
        estateDistribution: this.initialEstateDistribution,
    });

    willData$: Observable<WillData> = this.willDataSubject.asObservable();

    constructor() {}

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

    getEstateDistribution(): EstateDistributionData {
        return this.willDataSubject.value.estateDistribution;
    }

    saveWillData(): void {
        // In a real app, this would save to a backend
        console.log('Saving will data:', this.willDataSubject.value);
        alert('Your will has been saved successfully!');
    }
}
