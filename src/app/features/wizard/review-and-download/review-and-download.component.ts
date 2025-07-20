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
import { NotificationComponent } from './notification/notification.component';

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
        NotificationComponent,
    ],
    templateUrl: './review-and-download.component.html',
    styleUrls: ['./review-and-download.component.scss'],
})
export class ReviewAndDownloadComponent implements OnInit {
    willData!: WillData;
    isLoading = true;

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
    showDownloadNotification = false;
    isDownloading = false;

    platformId: object;
    appId: string;
    constructor(
        private router: Router,
        private willDataService: WillDataService,
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: object,
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
            this.isLoading = false;
        }
    }

    loadPdfAsBlob(): void {
        this.isLoading = true;
        this.pdfError = false;
        this.originalPdfData = null;
        this.pdfSrc = null;
        this.http
            .get('/doc/sample-will.pdf', { responseType: 'arraybuffer' })
            .pipe(
                catchError((error) => {
                    console.error('Failed to load PDF:', error.message);
                    this.pdfError = true;
                    this.isLoading = false;
                    return of(null);
                })
            )
            .subscribe((response) => {
                if (response) {
                    this.originalPdfData = new Uint8Array(response);
                    this.pdfSrc = this.originalPdfData.slice();
                    this.pdfError = false;
                } else {
                    this.pdfError = true;
                }
                this.isLoading = false;
            });
    }

    openModal(): void {
        if (!this.originalPdfData) return;
        this.modalPdfSrc = this.originalPdfData.slice();
        this.modalPdfError = false;
        this.isModalOpen = true;
        if (this.isBrowser) document.body.style.overflow = 'hidden';
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.modalPdfSrc = null;
        if (this.isBrowser) document.body.style.overflow = 'auto';
        if (this.originalPdfData) {
            this.pdfSrc = this.originalPdfData.slice();
            this.pdfError = false;
        } else {
            this.pdfSrc = null;
            this.pdfError = true;
        }
    }

    signAndValidate(): void {
        // Navigate to signing page or open signing modal
    }

    downloadWatermarked(): void {
        if (!this.isBrowser || this.isDownloading) return;

        this.isDownloading = true;
        this.http
            .get('doc/sample-will-watermarked.pdf', { responseType: 'blob' })
            .pipe(
                catchError((error) => {
                    console.error('Failed to download watermarked PDF:', error);
                    this.isDownloading = false;
                    // Optionally, show an error notification here
                    return of(null);
                })
            )
            .subscribe((blob) => {
                if (blob) {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'EasyWills-Watermarked-Will.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    // Show notification only after download is triggered
                    this.showDownloadNotification = true;
                    setTimeout(() => {
                        this.showDownloadNotification = false;
                    }, 5000); // Hide after 5 seconds
                }
                this.isDownloading = false;
            });
    }

    editWill(): void {
        this.router.navigate(['/wizard/will/personal-details']);
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
        if (viewerType === 'main') {
            this.totalPages = pdf.numPages;
        } else if (viewerType === 'modal') {
            this.totalPagesModal = pdf.numPages;
        }
        this.calculateZoom(viewerType);
    }

    calculateZoom(viewerType: 'main' | 'modal'): void {
        if (viewerType === 'main') this.zoom = 0.8;
    }

    onPdfError(error: Error, viewerType: 'main' | 'modal'): void {
        console.error(`Error loading PDF for ${viewerType} viewer:`, error);
        if (viewerType === 'main') {
            this.pdfError = true;
        } else if (viewerType === 'modal') {
            this.modalPdfError = true;
        }
    }

    onModalKeydown(event: KeyboardEvent): void {
        event.stopPropagation();
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.closeModal();
        }
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }
}
