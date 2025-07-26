import type { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MyWillComponent } from './my-will/my-will.component';
// (No direct import needed, it will be lazy-loaded)

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'my-will', pathMatch: 'full' },
            {
                path: 'my-will',
                component: MyWillComponent,
                data: {
                    title: 'Welcome back, John Doe!',
                    subtitle:
                        "Here's an overview of your Will planning progress.",
                },
            },
            {
                path: 'my-documents',
                loadComponent: () =>
                    import('./my-documents/my-documents.component').then(
                        (m) => m.MyDocumentsComponent
                    ),
                data: {
                    title: 'Documents',
                    subtitle: 'Manage your Will documents and legal files',
                },
            },
            {
                path: 'digital-vault',
                loadComponent: () =>
                    import('./digital-vault/digital-vault.component').then(
                        (m) => m.DigitalVaultComponent
                    ),
                data: {
                    title: 'Digital Vault',
                    subtitle: 'Track and manage all action of your Will',
                },
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./settings/settings.routes').then(
                        (m) => m.settingsRoutes
                    ),
            },
        ],
    },
];

// Also export as 'routes' for app.routes.ts compatibility
export const routes = dashboardRoutes;
