import {APP_ID, Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {Appointment} from '../../../core/models/interfaces/lawyer.interface';
import {LawyerService} from '../../../core/services/lawyer.service';
import {firstValueFrom, forkJoin, Observable, tap} from 'rxjs';
import {TimeUtils} from '../../../shared/utils/time-utils';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PDFPreviewComponent} from '../../../shared/components/pdf-preview/pdf-preview.component';
import {NotificationService} from '../../../core/utils/notification.service';


@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        PdfViewerModule,
        PDFPreviewComponent
    ],
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
    activeTab: 'upcoming' | 'completed' = 'upcoming';
    searchQuery = '';

    // Sample appointments data
    appointments: Appointment[] = [];

    nextAppointment: Appointment | null = null;
    upcomingCount = 0;
    completedCount = 0;
    pendingWillUploadCount = 0;

    previewAppointment?: Appointment

    isWillViewOpen = false;
    originalPdfData: Uint8Array | null = null;

    pdfSrc: Uint8Array | null = null;
    modalPdfSrc: Uint8Array | null = null;

    isBrowser: boolean;
    pdfError = false;
    modalPdfError = false;

    zoom = 1.0;
    modalZoom = 0.9;
    currentPage = 1;
    totalPages = 0;
    totalPagesModal = 0;

    isModalOpen = false;

    // platformId: string;
    // appId: string;

    notification = inject(NotificationService);

    constructor(private lawyerService: LawyerService,
                @Inject(PLATFORM_ID) platformId: string,
                @Inject(APP_ID) appId: string
    ) {
        // this.platformId = platformId;
        // this.appId = appId;
        this.isBrowser = isPlatformBrowser(platformId);

    }

    async ngOnInit(): Promise<void> {
        await firstValueFrom(
            forkJoin({
                upcoming: this.lawyerService.getMyFirmUpcomingAppointments(),
                completed: this.lawyerService.getMyFirmCompletedAppointments()
            }).pipe(
                tap(({upcoming, completed}: { upcoming: Appointment[]; completed: Appointment[] }) => {
                    this.appointments.push(...upcoming);
                    this.appointments.push(...completed)
                    this.calculateCounts();
                    this.setNextAppointment();

                })
            )
        );
    }

    setActiveTab(tab: 'upcoming' | 'completed'): void {
        this.activeTab = tab;
    }

    onSearch(): void {
        // Search functionality will be implemented later
        console.log('Searching for:', this.searchQuery);
    }

    getFilteredAppointments(): Appointment[] {
        let filtered = this.appointments.filter(
            (apt) => apt.status === this.activeTab
        );

        // Apply search filter if query exists
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (apt) =>
                    apt.clientName.toLowerCase().includes(query) ||
                    apt.address.toLowerCase().includes(query)
            );
        }

        return filtered;
    }

    getInitials(name: string): string {
        if (!name)
            return ""
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2); // Take only first 2 initials
    }

    formatTime(time: string): string {
        return TimeUtils.get12HoursTime(time)
    }

    toggleAccordion(appointment: Appointment): void {
        // Close all other accordions
        this.appointments.forEach((apt) => {
            if (apt.id !== appointment.id) {
                apt.expanded = false;
            }
        });
        // Toggle the clicked accordion
        appointment.expanded = !appointment.expanded;
    }

    viewWill(appointment: Appointment): void {
        this.isWillViewOpen = true;
        this.previewAppointment = appointment
    }

    markAsComplete(appointment: Appointment): void {
        this.lawyerService.markAppointmentCompleted(appointment.id)
            .subscribe({
                next: () => {
                    appointment.status = 'completed';
                    this.calculateCounts();
                    this.setNextAppointment();
                },
                error: (err) => {
                    this.notification.showError(err.error.message);
                },
            })
    }

    uploadSignedWill(appointment: Appointment): void {
        // Create a temporary file input to pick the signed will from local system
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf,image/*';

        input.onchange = () => {
            const file = input.files && input.files[0];
            if (!file) return;

            this.lawyerService.uploadWill(appointment.id, file).subscribe({
                next: () => {
                    appointment.willUploaded = true;
                    this.notification.showSuccess('Signed will uploaded successfully');
                },
                error: (err) => {
                    const message = err?.error?.message || 'Failed to upload signed will';
                    this.notification.showError(message);
                },
            });
        };

        // trigger the file dialog
        input.click();
    }

    private calculateCounts(): void {
        this.upcomingCount = this.appointments.filter(
            (apt) => apt.status === 'upcoming'
        ).length;
        this.completedCount = this.appointments.filter(
            (apt) => apt.status === 'completed'
        ).length;
        this.pendingWillUploadCount = this.appointments.filter(
            (apt) => apt.status === 'completed' && !apt.willUploaded
        ).length
    }

    private setNextAppointment(): void {
        const upcoming = this.appointments
            .filter((apt) => apt.status === 'upcoming')
            .sort((a, b) => {
                // Simple sorting by date string (works for this format)
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

        this.nextAppointment = upcoming.length > 0 ? upcoming[0] : null;
    }

    closeWillViewModal(): void {
        this.isWillViewOpen = false;
    }

    onRequestPreview(): Observable<any> {
        return this.lawyerService.previewWill(this.previewAppointment?.id as unknown as number)
    }


}
