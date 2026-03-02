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
                path: 'help-centre/account-setup',
                loadComponent: () =>
                    import('./pages/help-centre/account-setup-help/account-setup-help.component').then(
                        (m) => m.AccountSetupHelpComponent
                    ),
            },
            {
                path: 'help-centre/will-creation',
                loadComponent: () =>
                    import('./pages/help-centre/will-creation-help/will-creation-help.component').then(
                        (m) => m.WillCreationHelpComponent
                    ),
            },
            {
                path: 'help-centre/plan-upgrade',
                loadComponent: () =>
                    import('./pages/help-centre/plan-upgrade-help/plan-upgrade-help.component').then(
                        (m) => m.PlanUpgradeHelpComponent
                    ),
            },
            {
                path: 'help-centre/data-security',
                loadComponent: () =>
                    import('./pages/help-centre/data-security-help/data-security-help.component').then(
                        (m) => m.DataSecurityHelpComponent
                    ),
            },
            {
                path: 'help-centre/legal-validity',
                loadComponent: () =>
                    import('./pages/help-centre/legal-validity-help/legal-validity-help.component').then(
                        (m) => m.LegalValidityHelpComponent
                    ),
            },
            {
                path: 'help-centre/password-recovery',
                loadComponent: () =>
                    import('./pages/help-centre/password-recovery-help/password-recovery-help.component').then(
                        (m) => m.PasswordRecoveryHelpComponent
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
