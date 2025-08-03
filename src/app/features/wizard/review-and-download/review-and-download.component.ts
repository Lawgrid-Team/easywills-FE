import {
    Component,
    type OnInit,
    PLATFORM_ID,
    Inject,
    APP_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { WillData } from '../../../core/models/interfaces/will-data.interface';
import { HeaderComponent } from '../widget/header/header.component';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
    selector: 'app-review-and-download',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        HeaderComponent,
        PdfViewerModule,
    ],
    templateUrl: './review-and-download.component.html',
    styleUrls: ['./review-and-download.component.scss'],
})
export class ReviewAndDownloadComponent implements OnInit {
    willData!: WillData;
    isLoading = true; // True only for initial load

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

    platformId: string;
    appId: string;

    constructor(
        private router: Router,
        private willDataService: WillDataService,
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: string,
        @Inject(APP_ID) appId: string
    ) {
        this.platformId = platformId;
        this.appId = appId;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        this.willData = this.willDataService.getWillData();
        if (this.isBrowser) {
            this.loadPdfAsBlob();
        } else {
            this.isLoading = false; // SSR: no loading
        }
    }

    loadPdfAsBlob(): void {
        this.isLoading = true; // Set loading true at the start of the fetch
        this.pdfError = false;
        this.originalPdfData = null;
        this.pdfSrc = null;
        console.log('Loading PDF from confirmed path: /doc/sample-will.pdf');
        this.http
            .get('/doc/sample-will.pdf', { responseType: 'arraybuffer' })
            .pipe(
                catchError((error) => {
                    console.error('Failed to load PDF:', error.message);
                    this.pdfError = true;
                    this.isLoading = false; // Stop loading on error
                    return of(null);
                })
            )
            .subscribe((response) => {
                if (response) {
                    console.log('Successfully fetched PDF data');
                    this.originalPdfData = new Uint8Array(response);
                    this.pdfSrc = this.originalPdfData.slice(); // Give main viewer its first copy
                    this.pdfError = false; // Explicitly set no error on success
                } else {
                    console.error('No response received for PDF');
                    this.pdfError = true;
                }
                this.isLoading = false; // Stop loading on success or if response is null
            });
    }

    openModal(): void {
        if (!this.originalPdfData) {
            console.error(
                'Cannot open modal: Original PDF data is not loaded.'
            );
            this.modalPdfError = true;
            this.isModalOpen = true;
            if (this.isBrowser) document.body.style.overflow = 'hidden';
            return;
        }

        this.modalPdfSrc = this.originalPdfData.slice(); // Give modal viewer its own copy
        this.modalPdfError = false;
        this.isModalOpen = true;
        if (this.isBrowser) document.body.style.overflow = 'hidden';
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.modalPdfSrc = null; // Release the modal's copy
        if (this.isBrowser) {
            document.body.style.overflow = 'auto';
        }

        // When modal closes, ensure the main viewer gets a fresh, usable PDF source
        // This is crucial for when it's re-added to the DOM via *ngIf
        if (this.originalPdfData) {
            this.pdfSrc = this.originalPdfData.slice(); // Re-assign a fresh copy
            this.pdfError = false; // Reset error state for main viewer
            console.log('Refreshed pdfSrc for main viewer after modal close.');
        } else {
            // If original data is somehow gone (shouldn't happen in this flow but good for robustness)
            this.pdfSrc = null;
            this.pdfError = true;
        }
    }

    signAndValidate(): void {
        this.router.navigate(['/wiz/will/upgrade']);
        /* ... */
    }
    downloadWatermarked(): void {
        /* ... */
    }
    editWill(): void {
        /* ... */
    }

    nextPage(): void {
        const currentTotalPages = this.isModalOpen
            ? this.totalPagesModal
            : this.totalPages;
        if (this.currentPage < currentTotalPages) {
            this.currentPage++;
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    onPdfLoaded(pdf: { numPages: number }, viewerType: 'main' | 'modal'): void {
        console.log(
            `PDF loaded successfully for ${viewerType} viewer:`,
            pdf.numPages,
            'pages'
        );
        if (viewerType === 'main') {
            this.totalPages = pdf.numPages;
            // No need to set isLoading false here, loadPdfAsBlob handles it
        } else if (viewerType === 'modal') {
            this.totalPagesModal = pdf.numPages;
        }
        this.calculateZoom(viewerType);
    }

    calculateZoom(viewerType: 'main' | 'modal'): void {
        if (viewerType === 'main') this.zoom = 0.8; // Default zoom for main viewer
        // modalZoom is already set
    }

    onPdfError(error: Error, viewerType: 'main' | 'modal'): void {
        console.error(`Error loading PDF for ${viewerType} viewer:`, error);
        if (viewerType === 'main') {
            this.pdfError = true;
            // No need to set isLoading false here, loadPdfAsBlob handles it
        } else if (viewerType === 'modal') {
            this.modalPdfError = true;
        }
    }

    onModalKeydown(event: KeyboardEvent): void {
        // Prevent event bubbling for keyboard events
        event.stopPropagation();

        // Optional: Handle Escape key to close modal
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        // Close modal on Enter or Space key
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.closeModal();
        }
        // Also handle Escape key
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }
}
