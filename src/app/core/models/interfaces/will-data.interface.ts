export interface Spouse {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateOfMarriage: string;
}

export interface Child {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
}

export interface Executor {
    id: string;
    type: 'individual' | 'organization';
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export interface Witness {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationship: string;
}

export interface Beneficiary {
    id: string;
    type: 'individual' | 'organization';
    firstName: string;
    lastName: string;
    relationship: string;
    dateOfBirth: string;
}

export interface Exclusion {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    reason?: string;
}

export interface PersonalDetailsData {
    title: string;
    firstName: string;
    lastName: string;
    otherNames: string;
    hasUsedOtherNames: boolean;
    otherFullName: string;
    dateOfBirth: string;
    stateOfOrigin: string;
    // email: string;
    // phoneNumber: string;
    // Address fields
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    // Marital status and family
    isMarried: boolean;
    spouses: Spouse[];
    hasChildren: boolean;
    children: Child[];
    beneficiaries: Beneficiary[];

    // executors: Executor[];
    // hasExecutor: boolean;
    // witnesses: Witness[];
    // hasWitnesses: boolean;
}

 // Executor and witnesses
export interface  ExecutorAndWitnessData {
    executors: Executor[];
    hasExecutor: boolean;
    witnesses: Witness[];
    hasWitnesses: boolean;
}

export interface RealEstateProperty {
    id: string;
    propertyType: string;
    propertyTitle: string;
    address: string;
    city: string;
    state: string;
    country: string;
    ownershipType: string;
}

export interface BankAccount {
    id: string;
    accountType: string;
    institution: string;
    accountNumber: string;
}

export interface AssetInventoryData {
    realEstateProperties: RealEstateProperty[];
    bankAccounts: BankAccount[];
    completedAssetTypes: string[];
}

// Individual asset assignment interface
export interface AssetAssignment {
    assetId: string;
    beneficiaryId: string;
}

export interface EstateDistributionData {
    sharingAsAWhole: boolean;
    beneficiaryShares?: { [key: string]: number }; // Maps beneficiary ID to percentage
    individualAssetAssignments?: { [assetId: string]: string }; // Maps asset ID to beneficiary ID
    exclusions: Exclusion[]; // List of excluded individuals or entities
}

export interface WillData {
    personalDetails: PersonalDetailsData;
    assetInventory: AssetInventoryData;
    estateDistribution: EstateDistributionData;
    executorAndWitness: ExecutorAndWitnessData;
}
