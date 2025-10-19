// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FooterComponent } from '../widget/footer/footer.component';
// import { HeaderComponent } from '../widget/header/header.component';
// import { ValidationStepsComponent } from './validation-steps/validation-steps.component';
// import { VerifyInfoComponent } from './verify-info/verify-info.component';
// import { VerifyIntroComponent } from './verify-intro/verify-intro.component';
// import { Router } from '@angular/router';
// //import { IdentityVerificationData } from '../../../../core/models/will-data.interface';
// import { IdentityVerificationData } from '../../../core/models/interfaces/will-data.interface';
// import { WillDataService } from '../../../core/services/Wizard/will-data.service';

// @Component({
//   selector: 'app-verify-account',
//   standalone: true,
//   imports: [
//     ValidationStepsComponent,
//     CommonModule,
//     HeaderComponent,
//     FooterComponent,
//     VerifyInfoComponent,
//     VerifyIntroComponent
//   ],
//   templateUrl: './verify-account.component.html',
//   styleUrl: './verify-account.component.scss'
// })
// export class VerifyAccountComponent {
//   step = 0;
//   isFormValid = false;
//   showSuccessPopup = false;
//   identityVerificationData!: IdentityVerificationData;

//   constructor(
//     private router: Router,
//     private willDataService: WillDataService
//   ) {}

//   handleIdentitySave(data: IdentityVerificationData): void {
//   this.identityVerificationData = data;
//   this.willDataService.saveIdentityVerification(data);
//   this.router.navigate(['/wiz/will/schedule']);
// }

//   ngOnInit(): void {
//     this.isFormValid = true;
//   }

//   handleNext(): void {
//     if (this.step === 2) {
//       this.router.navigate(['/wiz/will/schedule']);
//     } else {
//       this.step++;
//       this.isFormValid = false;
//       window.scrollTo(0, 0);
//     }
//   }

//   handleBack(): void {
//     if (this.step > 0) {
//       this.step--;
//       this.isFormValid = true;
//       window.scrollTo(0, 0);
//     } else {
//       this.router.navigate(['/wiz/will/verify-account']);
//     }
//   }

//   setFormValidity(isValid: boolean): void {
//     this.isFormValid = isValid;
//   }

//   handleFormSubmit(formData: { date: string; time: string }): void {
//     this.willDataService.saveScheduleInfo(formData);
//     this.showSuccessPopup = true;
//   }

//   confirmAndRedirect(): void {
//     this.showSuccessPopup = false;
//     this.router.navigate(['/wiz/will/welcome']);
//   }
// }

import {
    Component,
    ElementRef,
    Renderer2,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';

import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';
import { ValidationStepsComponent } from './validation-steps/validation-steps.component';
import { VerifyInfoComponent } from './verify-info/verify-info.component';
import { VerifyIntroComponent } from './verify-intro/verify-intro.component';

import { IdentityVerificationData } from '../../../core/models/interfaces/will-data.interface';
import { WillDataService } from '../../../core/services/Wizard/will-data.service';
import { QoreidService } from '../../../core/services/Wizard/qoreid.service';

@Component({
    selector: 'app-verify-account',
    standalone: true,
    imports: [
        CommonModule,
        // HttpClientModule,
        HeaderComponent,
        FooterComponent,
        ValidationStepsComponent,
        VerifyIntroComponent,
        VerifyInfoComponent,
    ],
    templateUrl: './verify-account.component.html',
    styleUrl: './verify-account.component.scss',
})
export class VerifyAccountComponent implements OnInit, OnDestroy {
    step = 0;
    isFormValid = false;
    showSuccessPopup = false;
    identityVerificationData!: IdentityVerificationData;
    private subscription = new Subscription();

    constructor(
        private router: Router,
        private willDataService: WillDataService,
        private qoreid: QoreidService,
        private renderer: Renderer2,
        private el: ElementRef
    ) {}

    ngOnInit(): void {
        this.isFormValid = true;
        // Preload QoreID SDK
        this.subscription.add(this.qoreid.loadSdk().subscribe());
    }

    /** Called when VerifyInfoComponent emits identitySaved */
    handleIdentitySave(data: IdentityVerificationData): void {
        this.identityVerificationData = data;
        this.willDataService.saveIdentityVerification(data);

        // ensure expiryDate is a string (convert Date to YYYY-MM-DD ISO string)
        const expiryString: string =
            typeof data.expiryDate === 'string'
                ? data.expiryDate
                : data.expiryDate instanceof Date
                ? data.expiryDate.toISOString().split('T')[0]
                : String(data.expiryDate ?? '');

        const payload = {
            idNumber: data.idNumber,
            type:
                data.documentType === 'National Passport'
                    ? 'PASSPORT'
                    : data.documentType === 'National ID Card'
                    ? 'NIN'
                    : 'DRIVERS_LICENSE',
            expiryDate: expiryString,
        };

        this.subscription.add(
            this.qoreid
                .initializeIdentity(payload)
                .pipe(
                    switchMap((res: any) =>
                        this.qoreid.loadSdk().pipe(
                            tap(() => {
                                this.injectQoreidButton(res);
                                this.qoreid.startVerification();
                            })
                        )
                    )
                )
                .subscribe({
                    next: () => console.log('Verification started'),
                    error: (err) => console.error('Initialization failed', err),
                })
        );
    }

    /** Dynamically create and insert the qoreid-button element */
    private injectQoreidButton(res: any): void {
        const container =
            this.el.nativeElement.querySelector('#qoreid-container');
        if (!container) return;

        container.innerHTML = ''; // Clear existing instance
        const qoreidBtn = this.renderer.createElement('qoreid-button');
        this.renderer.setAttribute(qoreidBtn, 'id', 'QoreIDButton');
        this.renderer.setAttribute(qoreidBtn, 'hideButton', 'yes');
        this.renderer.setAttribute(qoreidBtn, 'clientId', res.clientId);
        this.renderer.setAttribute(qoreidBtn, 'flowId', res.flowId);
        this.renderer.setAttribute(
            qoreidBtn,
            'customerReference',
            res.reference
        );
        this.renderer.setAttribute(
            qoreidBtn,
            'applicantData',
            JSON.stringify(res.applicantData)
        );

        // Event listeners
        qoreidBtn.addEventListener('qoreid:verificationSubmitted', (e: any) => {
            console.log('✅ Verification submitted:', e.detail);
            this.showSuccessPopup = true;
        });
        qoreidBtn.addEventListener('qoreid:verificationError', (e: any) => {
            console.error('❌ Verification error:', e.detail);
        });
        qoreidBtn.addEventListener('qoreid:verificationClosed', (e: any) => {
            console.log('ℹ️ Verification closed:', e.detail);
        });

        this.renderer.appendChild(container, qoreidBtn);
    }

    /** Navigation logic (unchanged) */
    handleNext(): void {
        if (this.step === 2) {
            this.router.navigate(['/wiz/will/schedule']);
        } else {
            this.step++;
            this.isFormValid = false;
            window.scrollTo(0, 0);
        }
    }

    handleBack(): void {
        if (this.step > 0) {
            this.step--;
            this.isFormValid = true;
            window.scrollTo(0, 0);
        } else {
            this.router.navigate(['/wiz/will/verify-account']);
        }
    }

    setFormValidity(isValid: boolean): void {
        this.isFormValid = isValid;
    }

    handleFormSubmit(formData: { date: string; time: string }): void {
        this.willDataService.saveScheduleInfo(formData);
        this.showSuccessPopup = true;
    }

    confirmAndRedirect(): void {
        this.showSuccessPopup = false;
        this.router.navigate(['/wiz/will/welcome']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
