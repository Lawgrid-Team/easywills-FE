import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../widget/footer/footer.component';
import { HeaderComponent } from '../widget/header/header.component';

interface Plan {
  name: string;
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
      description: 'Get started with our platform at no cost. Perfect for those who want to explore the process and create a basic will with ease.',
      price: 'Free',
      isCurrent: true
    },
    {
      name: 'Legacy',
      description: 'Perfect for individuals with straightforward estate planning needs. Create a legally binding will with confidence and ease.',
      price: '₦ 100,000'
    },
    {
      name: 'Legacy+',
      description: 'Designed for those with more detailed estate planning needs, the Premium Plan offers additional flexibility and support to ensure your will is comprehensive and up-to-date.',
      price: '₦ 250,000'
    },
    {
      name: 'Custom plan',
      description: 'Tailored for individuals with unique estate planning needs, the Custom Plan gives you complete flexibility to create a will that fits your specific circumstances.',
      price: 'Custom'
    }
  ];


  selectedPlan = this.plans.find(p => p.isCurrent) ?? this.plans[0];

  constructor(private router: Router) {}

  selectPlan(plan: Plan) {
    this.selectedPlan = plan;
  }

  proceedToPayment() {
    // Example: pass selected plan via route state or query params
    this.router.navigate(['/wiz/will/verify-account'], {
      state: { plan: this.selectedPlan }
    });
  }
}
