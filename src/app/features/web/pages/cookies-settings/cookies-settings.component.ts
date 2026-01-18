import { Component, HostListener, OnInit, PLATFORM_ID, Inject }  from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookies-settings',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './cookies-settings.component.html',
  styleUrl: './cookies-settings.component.scss'
})
export class CookiesSettingsComponent implements OnInit {
  activeSection = 'introduction';
  isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
    
    const sections = ['introduction', 'information-collection', 'data-storage', 'access-control', 'contact-us'];
    const scrollPosition = window.scrollY + 200; // Offset to trigger section change earlier

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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

  tableData = [
    {
      service: 'Google Analytics',
      purpose: 'Usage analytics & site traffic',
      policy: 'https://policies.google.com/privacy'
    },
    {
      service: 'Firebase (Google)',
      purpose: 'Web/app analytics & authentication',
      policy: 'https://firebase.google.com/support/privacy'
    },
    {
      service: 'Payment processors',
      purpose: 'Secure transaction monitoring',
      policy: 'https://paystack.com/terms#privacy'
    },
    {
      service: 'QoreID',
      purpose: 'Secure Identity validation',
      policy: 'https://qoreid.com/privacy-policy'
    }
  ];

}