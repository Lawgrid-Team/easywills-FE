import { Routes } from '@angular/router';
import { WebComponent } from './web.component';

export const routes: Routes = [
    {
        path: '',
        component: WebComponent,
        children: [
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full',
            },
            {
                path: '',
                loadComponent: () =>
                    import('./pages/home/home.component').then(
                        (m) => m.HomeComponent
                    ),
                pathMatch: 'full',
            },
            {
                path: 'about',
                loadComponent: () =>
                    import('./pages/about/about.component').then(
                        (m) => m.AboutComponent
                    ),
            },
            {
                path: 'help',
                loadComponent: () =>
                    import('./pages/help-centre/help-centre.component').then(
                        (m) => m.HelpCentreComponent
                    ),
            },
            {
                path: 'pricing',
                loadComponent: () =>
                    import('./pages/pricing/pricing.component').then(
                        (m) => m.PricingComponent
                    ),
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
