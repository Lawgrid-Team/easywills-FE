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
                path: 'privacy-policy',
                loadComponent: () =>
                    import('./pages/p-policy-and-t-of-service/privacy-policy/privacy-policy.component').then(
                        (m) => m.PrivacyPolicyComponent
                    ),
            },
            {
                path: 'terms-of-service',
                loadComponent: () =>
                    import('./pages/p-policy-and-t-of-service/terms-of-service/terms-of-service.component').then(
                        (m) => m.TermsOfServiceComponent
                    ),
            },
             {
                path: 'cookies-settings',
                loadComponent: () =>
                    import('./pages/cookies-settings/cookies-settings.component').then(
                        (m) => m.CookiesSettingsComponent
                    ),
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
