import {
    Component,
    HostListener,
    OnInit,
    PLATFORM_ID,
    Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-terms-of-service',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './terms-of-service.component.html',
    styleUrl: './terms-of-service.component.scss',
})
export class TermsOfServiceComponent implements OnInit {
    activeSection = 'introduction';
    isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        // Only run in browser environment
        if (this.isBrowser) {
            // Initialize the active section
            this.checkActiveSection();
        }
    }

    // Track active section based on scroll position
    @HostListener('window:scroll')
    checkActiveSection(): void {
        // Only run in browser environment
        if (!this.isBrowser) return;

        const sections = [
            'introduction',
            'content',
            'user-conduct',
            'intellectual-property',
            'indemnification',
        ];
        const scrollPosition = window.scrollY + 200; // Offset to trigger section change earlier

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const offsetTop = element.offsetTop;
                const offsetHeight = element.offsetHeight;

                if (
                    scrollPosition >= offsetTop &&
                    scrollPosition < offsetTop + offsetHeight
                ) {
                    this.activeSection = section;
                    break;
                }
            }
        }
    }

    // Handle scroll to section when clicking on sidebar links
    scrollToSection(sectionId: string): void {
        this.activeSection = sectionId;

        // Only run in browser environment
        if (!this.isBrowser) return;

        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
