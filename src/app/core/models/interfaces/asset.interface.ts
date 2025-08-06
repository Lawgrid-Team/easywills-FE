// Interface for beneficiary data
export interface BeneficiaryShare {
    id: string;
    name: string;
    type: string;
    dateInfo: string;
    percentage: number;
}
// Interface for asset types
export interface AssetType {
    id: string;
    name: string;
    icon: string;
    count: number;
    assets: Asset[];
    expanded?: boolean; // Track if the asset type is expanded
}
// Interface for beneficiary assignments
export interface BeneficiaryAssignment {
    beneficiaryId: string;
    percentage: number;
}
// Interface for individual assets
export interface Asset {
    id: string;
    name: string;
    details: string;
    address?: string;
    ownershipType?: string;
    assignedTo?: string; // Beneficiary ID
    beneficiaries?: BeneficiaryAssignment[]; // Add this line
    remainingShare?: number; // Add this line
    showAssignments?: boolean; // Add this property to track if assignments are being shown/edited
}

