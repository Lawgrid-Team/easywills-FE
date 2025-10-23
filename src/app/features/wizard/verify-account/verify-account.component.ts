import {
    Component,
    ElementRef,
    Renderer2,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
        // Load SDK once (doc URL)
        this.subscription.add(this.qoreid.loadSdk().subscribe());
    }

    /** Called when child emits identity data */
    handleIdentitySave(data: IdentityVerificationData): void {
        this.willDataService.saveIdentityVerification(data);

        const expiryString =
            typeof data.expiryDate === 'string'
                ? data.expiryDate
                : data.expiryDate instanceof Date
                ? data.expiryDate.toISOString().split('T')[0]
                : String(data.expiryDate ?? '');

        const payload = {
            idNumber: data.idNumber,
            type: data.documentType,
            expiryDate: expiryString,
        };

        this.subscription.add(
            this.qoreid
                .initializeIdentity(payload)
                .pipe(
                    switchMap((res: any) =>
                        this.qoreid.loadSdk().pipe(
                            tap(() => {
                                // Use backend response exactly as-is
                                this.injectQoreidButton(res);
                                this.qoreid.startVerification();
                            })
                        )
                    )
                )
                .subscribe({
                    next: () => {
                        /* started */
                    },
                    error: (err) =>
                        console.error('Initialize/SDK flow failed:', err),
                })
        );
    }

    /** Inject the qoreid-button using ONLY the backend response */
    private injectQoreidButton(res: any): void {
        const container =
            this.el.nativeElement.querySelector('#qoreid-container');
        if (!container) return;

        container.innerHTML = '';
        const qoreidBtn = this.renderer.createElement('qoreid-button');

        this.renderer.setAttribute(qoreidBtn, 'id', 'QoreIDButton');
        this.renderer.setAttribute(qoreidBtn, 'hideButton', 'yes');
        this.renderer.setAttribute(qoreidBtn, 'clientId', String(res.clientId));
        this.renderer.setAttribute(qoreidBtn, 'flowId', String(res.flowId));
        this.renderer.setAttribute(
            qoreidBtn,
            'customerReference',
            String(res.reference)
        );

        if (res?.applicantData) {
            this.renderer.setAttribute(
                qoreidBtn,
                'applicantData',
                JSON.stringify(res.applicantData)
            );
        }
        if (res?.identityData) {
            this.renderer.setAttribute(
                qoreidBtn,
                'identityData',
                JSON.stringify(res.identityData)
            );
        }

        // SDK Events
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

    // nav & misc
    handleNext(): void {
        if (this.step === 2) return;
        this.step++;
        this.isFormValid = false;
        window.scrollTo(0, 0);
    }
    handleBack(): void {
        if (this.step > 0) {
            this.step--;
            this.isFormValid = true;
        } else {
            this.router.navigate(['/wiz/will/verify-account']);
        }
        window.scrollTo(0, 0);
    }
    setFormValidity(isValid: boolean): void {
        this.isFormValid = isValid;
    }
    handleFormSubmit(formData: { date: string; time: string }) {
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
