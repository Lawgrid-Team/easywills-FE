import type { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'my-will',
                loadComponent: () =>
                    import('./my-will/my-will.component').then(
                        (m) => m.MyWillComponent
                    ),
            },
            {
                path: 'my-documents',
                loadComponent: () =>
                    import('./my-documents/my-documents.component').then(
                        (m) => m.MyDocumentsComponent
                    ),
            },
            {
                path: '',
                redirectTo: 'my-will',
                pathMatch: 'full',
            },
        ],
    },
];
