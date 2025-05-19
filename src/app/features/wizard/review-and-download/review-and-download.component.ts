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
    pdfSrc: string | ArrayBuffer | null = null;
    isBrowser: boolean;
    pdfError = true; // Start with error state, will set to false if PDF loads

    // PDF viewer options
    zoom = 1.0;
    originalSize = false;
    showAll = true;
    currentPage = 1;
    totalPages = 0;

    // Array of paths to try
    pdfPaths = [
        '/doc/sample-will.pdf',
        'doc/sample-will.pdf',
        '/public/doc/sample-will.pdf',
        'public/doc/sample-will.pdf',
        'assets/doc/sample-will.pdf',
        '/assets/doc/sample-will.pdf',
        './doc/sample-will.pdf',
        '../doc/sample-will.pdf',
        '../../doc/sample-will.pdf',
        '../../../doc/sample-will.pdf',
        '../../../public/doc/sample-will.pdf',
    ];

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
        console.log('Attempting to load PDF as blob');

        // Try each path
        for (const path of this.pdfPaths) {
            console.log(`Checking path: ${path}`);

            // Use HTTP client to fetch the PDF as a blob
            this.http
                .get(path, {
                    responseType: 'blob',
                    observe: 'response',
                })
                .pipe(
                    catchError((error) => {
                        console.log(
                            `Failed to load from ${path}: ${error.message}`
                        );
                        return of(null);
                    })
                )
                .subscribe((response) => {
                    if (response && response.body) {
                        console.log(`Successfully loaded PDF from ${path}`);

                        // Create a FileReader to convert blob to data URL
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.pdfSrc = reader.result;
                            this.pdfError = false;
                            this.isLoading = false;
                        };
                        reader.readAsDataURL(response.body);

                        // Break the loop by not checking other paths
                        return;
                    }
                });
        }

        // Set a timeout to show error state if PDF doesn't load
        setTimeout(() => {
            if (this.isLoading) {
                console.error('Could not load PDF from any path');
                this.pdfError = true;
                this.isLoading = false;
            }
        }, 5000);
    }

    signAndValidate(): void {
        console.log('Sign and validate clicked');
        // Navigate to signing page or open signing modal
    }

    downloadWatermarked(): void {
        if (!this.isBrowser || !this.pdfSrc) return;

        console.log('Download watermarked version clicked');

        // Create a link element
        const link = document.createElement('a');

        // If pdfSrc is a data URL, use it directly
        if (
            typeof this.pdfSrc === 'string' &&
            this.pdfSrc.startsWith('data:')
        ) {
            link.href = this.pdfSrc;
        } else {
            // Fallback to a default path
            link.href = 'doc/sample-will.pdf';
        }

        link.download = 'your-will-watermarked.pdf';
        link.click();
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
    onPdfLoaded(pdf: any): void {
        console.log('PDF loaded successfully:', pdf);
        this.totalPages = pdf.numPages;
        this.isLoading = false;
        this.pdfError = false;
    }

    // Called when PDF fails to load
    onPdfError(error: any): void {
        console.error('Error loading PDF:', error);
        this.pdfError = true;
        this.isLoading = false;
    }
}
