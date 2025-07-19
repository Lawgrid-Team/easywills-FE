import type { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'my-will',
                // Lazy load the MyWillComponent
                loadComponent: () =>
                    import('./my-will/my-will.component').then(
                        (m) => m.MyWillComponent
                    ),
            },
            // You can add other dashboard pages here in the future
            // e.g., { path: 'my-documents', component: MyDocumentsComponent }
            {
                // Redirect empty path to 'my-will' by default
                path: '',
                redirectTo: 'my-will',
                pathMatch: 'full',
            },
        ],
    },
];
