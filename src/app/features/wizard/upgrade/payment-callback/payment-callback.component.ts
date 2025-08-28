import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanPackageService } from '../../../../core/services/Wizard/plan-package.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { HeaderComponent } from "../../widget/header/header.component";

@Component({
  selector: 'app-payment-successful',
  imports: [
    CommonModule,
    MatProgressSpinner,
    HeaderComponent
],
  templateUrl: './payment-callback.component.html',
  styleUrl: './payment-callback.component.scss'
})
export class PaymentCallbackComponent implements OnInit {
  paymentData = {} as any;

  loadingData = true;
  status = "pending"; // "success" | "failed" | "pending" | "error"

    constructor(private route: ActivatedRoute,
        private router: Router,
        private planPackageService: PlanPackageService) {}

  ngOnInit(): void {
    this.paymentData.reference = this.route.snapshot.queryParamMap.get('reference');
    this.paymentData.transactionId = this.route.snapshot.queryParamMap.get('trxref');

    this.planPackageService.checkoutUpgrade(this.paymentData).subscribe({
        next: (res: any) => {
            this.loadingData = false;
            if(res.status == "COMPLETED"){
                this.status = "success";
            } else if (res.status == "FAILED"){
                this.status = "failed";
            }
            setTimeout(() => {
                // Navigate to the desired page
                this.router.navigate(['/wiz/will/verify-account']);
            }, 5000); // 5 seconds


        },
        error: (err: any) => {
            console.error('Error during plan upgrade:', err);
            this.status = "error";
            this.loadingData = false;
        }
    });
  }
}
