export interface Appointment {
    id: number;
    clientName: string;
    locationType: string; // e.g., "Client's Home", "Office", "Hospital"
    address: string;
    date: string;
    time: string;
    willUploaded: boolean
    status: 'upcoming' | 'completed' | 'cancelled';
    profilePicture?: string; // Optional profile picture URL
    witnesses?: string[]; // List of witnesses
    expanded?: boolean; // Track expansion state
}

export interface AppointmentData {
    upcoming: Appointment[];
    completed: Appointment[];
}

// export enum LocationType {
//     OFFICE, CLIENT_ADDRESS
// }
