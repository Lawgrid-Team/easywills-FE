import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-subscription-management',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule],
    templateUrl: './subscription-management.component.html',
    styleUrl: './subscription-management.component.scss',
})
export class SubscriptionManagementComponent {
    showUpgradeModal = false;
    billingHistory = [
        {
            date: '27/07/2025',
            status: 'Successful',
            amount: '100,000',
            plan: 'Legacy',
            method: 'mastercard',
        },
        {
            date: '20/06/2025',
            status: 'Successful',
            amount: '100,000',
            plan: 'Legacy',
            method: 'mastercard',
        },
        {
            date: '16/05/2025',
            status: 'Unsuccessful',
            amount: '100,000',
            plan: 'Legacy',
            method: 'mastercard',
        },
        {
            date: '10/03/2025',
            status: 'Unsuccessful',
            amount: '100,000',
            plan: 'Legacy',
            method: 'mastercard',
        },
        {
            date: '6/02/2025',
            status: 'Successful',
            amount: '100,000',
            plan: 'Legacy',
            method: 'mastercard',
        },
    ];

    openUpgradeModal() {
        this.showUpgradeModal = true;
    }

    closeUpgradeModal() {
        this.showUpgradeModal = false;
    }
}
