import {
    Component,
    type OnInit,
    PLATFORM_ID,
    Inject,
    APP_ID,
    CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { WillData } from '../../../core/models/interfaces/will-data.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-view-will',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './view-will.component.html',
    styleUrls: ['./view-will.component.scss'],
})
export class ViewWillComponent implements OnInit {
    willData!: WillData;
    isLoading = true;
    pdfViewerModule: unknown = null;

    // User profile data (matching wizard welcome page)
    userName = 'John Doe';
    userEmail = 'johndoe@gmail.com';
    userAvatarUrl = '/svg/display-pic.svg';

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

    async ngOnInit(): Promise<void> {
        this.willData = this.willDataService.getWillData();
        if (this.isBrowser) {
            try {
                // Dynamically import PDF viewer module only in browser
                const { PdfViewerModule } = await import('ng2-pdf-viewer');
                this.pdfViewerModule = PdfViewerModule;
                this.loadPdfAsBlob();
            } catch (error) {
                console.error('Failed to load PDF viewer:', error);
                this.pdfError = true;
                this.isLoading = false;
            }
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
        if (this.isBrowser && typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.modalPdfSrc = null;
        if (this.isBrowser && typeof document !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
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

    onPdfLoaded(event: unknown, viewerType: 'main' | 'modal'): void {
        const pdf = event as { numPages: number };
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

    onPdfError(event: unknown, viewerType: 'main' | 'modal'): void {
        console.error(`Error loading PDF for ${viewerType} viewer:`, event);
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
