import { PlanPackageService } from './../../../core/services/Wizard/plan-package.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';
import { NotificationService } from '../../../core/utils/notification.service';

interface Plan {
  name: string;
  value: string;
  description: string;
  price: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'app-upgrade',
  imports: [CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './upgrade.component.html',
  styleUrl: './upgrade.component.scss'
})
export class UpgradeComponent {
  plans: Plan[] = [
    {
      name: 'Free',
      value: 'FREE',
      description: 'Get started with our platform at no cost. Perfect for those who want to explore the process and create a basic will with ease.',
      price: 'Free',
      isCurrent: true
    },
    {
      name: 'Legacy',
      value: 'LEGACY',
      description: 'Perfect for individuals with straightforward estate planning needs. Create a legally binding will with confidence and ease.',
      price: '₦ 100,000'
    },
    {
      name: 'Legacy+',
      value: 'LEGACY_PLUS',
      description: 'Designed for those with more detailed estate planning needs, the Premium Plan offers additional flexibility and support to ensure your will is comprehensive and up-to-date.',
      price: '₦ 250,000'
    },
    {
      name: 'Custom plan',
      value: 'CUSTOM_PLAN',
      description: 'Tailored for individuals with unique estate planning needs, the Custom Plan gives you complete flexibility to create a will that fits your specific circumstances.',
      price: 'Custom'
    }
  ];


    private notification = inject(NotificationService);
  selectedPlan = this.plans.find(p => p.isCurrent) ?? this.plans[0];

  constructor(private router: Router, private planPackageService: PlanPackageService) {}

  selectPlan(plan: Plan) {
    this.selectedPlan = plan;
  }

  proceedToPayment() {
    // Example: pass selected plan via route state or query params
    // this.router.navigate(['/wiz/will/verify-account'], {
    //   state: { plan: this.selectedPlan }
    // });
    if (this.selectedPlan.value === 'FREE') {
        alert('You are already on the Free plan.');
        return;
    }
    this.planPackageService.upgradePackage(this.selectedPlan.value).subscribe({
        next: (response) => {
            if (response && response.paymentUrl) {
                window.location.href = response.paymentUrl;
            } else {
            console.error('Payment URL not found in the response');
            }
        },
        error: (err: any) => {
            this.notification.showError(err.error.message);
        }
    });
  }
}
