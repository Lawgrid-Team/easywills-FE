import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit {
    activeSection = 'introduction';

    ngOnInit(): void {
        // Initialize the active section
        this.checkActiveSection();
    }

    // Track active section based on scroll position
    @HostListener('window:scroll')
    checkActiveSection(): void {
        const sections = [
            'introduction',
            'information-collection',
            'data-storage',
            'access-control',
            'contact-us',
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
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
