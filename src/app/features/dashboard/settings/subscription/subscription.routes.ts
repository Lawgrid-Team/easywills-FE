import type { Routes } from '@angular/router';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { ChangePaymentMethodComponent } from './change-payment-method/change-payment-method.component';

export const subscriptionRoutes: Routes = [
    {
        path: '',
        component: SubscriptionManagementComponent,
    },
    {
        path: 'change-payment-method',
        component: ChangePaymentMethodComponent,
    },
];
