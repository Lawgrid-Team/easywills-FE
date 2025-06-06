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

// Import PdfViewerModule conditionally to avoid SSR issues
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
        PdfViewerModule, // Still need to import it here for Angular to recognize it
    ],
    templateUrl: './review-and-download.component.html',
    styleUrls: ['./review-and-download.component.scss'],
})
export class ReviewAndDownloadComponent implements OnInit {
    willData!: WillData;
    isLoading = true;
    pdfSrc: string | Uint8Array | null = null;
    isBrowser: boolean;
    pdfError = true; // Start with error state, will set to false if PDF loads

    // PDF viewer options
    zoom = 1.0;
    originalSize = false;
    showAll = true;
    currentPage = 1;
    totalPages = 0;

    constructor(
        private router: Router,
        private willDataService: WillDataService,
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(APP_ID) private appId: string
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        // Get will data directly
        this.willData = this.willDataService.getWillData();

        // Only load PDF in browser environment
        if (this.isBrowser) {
            this.loadPdfAsBlob();
        } else {
            // Skip loading for server-side rendering
            this.isLoading = false;
        }
    }

    // Try to load PDF as a blob
    loadPdfAsBlob(): void {
        console.log('Loading PDF from confirmed path: /doc/sample-will.pdf');

        // Use HTTP client to fetch the PDF as arraybuffer
        this.http
            .get('/doc/sample-will.pdf', {
                responseType: 'arraybuffer',
            })
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
                    console.log('Successfully loaded PDF');

                    // Convert ArrayBuffer to Uint8Array
                    this.pdfSrc = new Uint8Array(response);
                    this.pdfError = false;
                    this.isLoading = false;
                } else {
                    console.error('No response received for PDF');
                    this.pdfError = true;
                    this.isLoading = false;
                }
            });
    }

    signAndValidate(): void {
        console.log('Sign and validate clicked');
        // Navigate to signing page or open signing modal
    }

    downloadWatermarked(): void {
        if (!this.isBrowser || !this.pdfSrc) return;

        console.log('Download watermarked version clicked');

        // Create a blob from the Uint8Array
        let blob: Blob;
        if (this.pdfSrc instanceof Uint8Array) {
            blob = new Blob([this.pdfSrc], { type: 'application/pdf' });
        } else {
            // Fallback - try to fetch the PDF again
            console.warn('PDF source is not available, using fallback');
            return;
        }

        // Create a link element
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'your-will-watermarked.pdf';
        link.click();

        // Clean up the object URL
        URL.revokeObjectURL(url);
    }

    editWill(): void {
        console.log('Edit will clicked');
        // Navigate back to appropriate section for editing
        this.router.navigate(['/wizard/will/personal-details']);
    }

    // PDF viewer navigation methods
    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    // Called when PDF is loaded
    // Update the onPdfLoaded method
    onPdfLoaded(pdf: any): void {
        console.log('PDF loaded successfully:', pdf);
        this.totalPages = pdf.numPages;
        this.isLoading = false;
        this.pdfError = false;

        // Calculate zoom to fit container
        this.calculateZoom();
    }

    // Add this method to calculate appropriate zoom
    calculateZoom(): void {
        // Default zoom that works well for most PDFs
        this.zoom = 0.75;
    }

    // Called when PDF fails to load
    onPdfError(error: any): void {
        console.error('Error loading PDF:', error);
        this.pdfError = true;
        this.isLoading = false;
    }
}
