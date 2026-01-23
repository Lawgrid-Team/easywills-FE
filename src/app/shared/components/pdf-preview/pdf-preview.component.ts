import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-pdf-preview',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, PdfViewerModule, MatProgressSpinner],
    templateUrl: '../pdf-preview/pdf-preview.component.html',
    styleUrls: ['../pdf-preview/pdf-preview.component.scss'],
})
export class PDFPreviewComponent {
    @Input() isOpen = false;
    @Input() isBrowser = true;
    @Input() preview$: Observable<any> | null = null;

    isLoading = false;
    pdfSrc: Uint8Array | null = null;
    pdfError = false;
    currentPage = 1;
    totalPages = 0;
    zoom = 1.0;

    modalZoom = 0.9;


    originalPdfData: Uint8Array | null = null;

    modalPdfSrc: Uint8Array | null = null;

    modalPdfError = false;
    isModalOpen = false;
    totalPagesModal = 0;

    @Output() close = new EventEmitter<void>();
    errorMessage = "Could not load PDF preview. Please try again or check your connection.";

    ngOnInit(): void {
        if (this.isBrowser) {
            this.loadPdfAsBlob();
        } else {
            this.isLoading = false; // SSR: no loading
        }
    }

    onOverlayClick(): void {
        this.close.emit();
    }

    @HostListener('document:keydown.escape')
    onEsc(): void {
        if (this.isOpen) this.close.emit();
    }

    loadPdfAsBlob(): void {
        this.isLoading = true; // Set loading true at the start of the fetch
        this.pdfError = false;
        this.originalPdfData = null;
        this.pdfSrc = null;
        this.errorMessage = 'Could not load PDF preview. Please try again or check your connection.'
        if (this.preview$ && typeof (this.preview$ as any).subscribe === 'function') {
            (this.preview$ as Observable<any>).subscribe({
                next: (response: any) => {
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
                },
                error: (error: any) => {
                    console.error('Error fetching personal details:', error);
                    // error.error is an ArrayBuffer, convert it to string
                    if (error && error.error instanceof ArrayBuffer) {
                        const decoder = new TextDecoder('utf-8');
                        const errorString = decoder.decode(error.error);
                        try {
                            const errorObj = JSON.parse(errorString);
                            this.errorMessage = errorObj.message || errorString;
                        } catch {
                            this.errorMessage = errorString;
                        }
                    } else {
                        this.errorMessage = 'Could not load PDF preview. Please try again or check your connection.';
                    }
                    this.pdfError = true;
                    this.isLoading = false;
                }
            });
        } else {
            // If no observable is returned, stop loading and set error
            this.isLoading = false;
            this.pdfError = true;
            console.error('No Observable returned from requestPreview event.');
        }
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
        } else {
            // If original data is somehow gone (shouldn't happen in this flow but good for robustness)
            this.pdfSrc = null;
            this.pdfError = true;
        }
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
