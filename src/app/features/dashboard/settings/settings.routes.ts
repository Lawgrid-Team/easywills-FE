import type { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';
import { PasswordManagementComponent } from './password-management/password-management.component';

export const settingsRoutes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'profile', component: ProfileManagementComponent },
            { path: 'password', component: PasswordManagementComponent },
            {
                path: 'subscription',
                loadChildren: () =>
                    import('./subscription/subscription.routes').then(
                        (r) => r.subscriptionRoutes
                    ),
            },
        ],
    },
];
