import type { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MyWillComponent } from './my-will/my-will.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';

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
                component: MyDocumentsComponent,
                data: {
                    title: 'Documents',
                    subtitle: 'Manage your Will documents and legal files',
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
