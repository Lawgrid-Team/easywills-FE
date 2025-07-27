import { Routes } from '@angular/router';
import { WizardComponent } from './wizard.component';

export const routes: Routes = [
    {
        path: '',
        component: WizardComponent,
        children: [
            {
                path: '',
                redirectTo: 'welcome',
                pathMatch: 'full',
            },
            {
                path: 'welcome',
                loadComponent: () =>
                    import('./welcome/welcome.component').then(
                        (m) => m.WelcomeComponent
                    ),
            },
            {
                path: 'will',
                component: WizardComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'personal-details',
                        pathMatch: 'full',
                    },
                    {
                        path: 'personal-details',
                        loadComponent: () =>
                            import(
                                './personal-details/personal-details.component'
                            ).then((m) => m.PersonalDetailsComponent),
                    },
                    {
                        path: 'asset-inventory',
                        loadComponent: () =>
                            import(
                                './asset-inventory/asset-inventory.component'
                            ).then((m) => m.AssetInventoryComponent),
                    },
                    {
                        path: 'estate-distribution',
                        loadComponent: () =>
                            import(
                                './estate-distribution/estate-distribution.component'
                            ).then((m) => m.EstateDistributionComponent),
                    },
                    {
                        path: 'executor-and-witnesses',
                        loadComponent: () =>
                            import(
                                './executor-and-witnesses/executor-and-witnesses.component'
                            ).then((m) => m.ExecutorAndWitnessesComponent),
                    },
                    {

                        path: "schedule",
                        loadComponent: () =>
                            import(
                                './schedule/schedule.component'
                            ).then((m) => m.ScheduleComponent),
                    },
                    {
                        path: "verify-account",
                        loadComponent: () =>
                            import(
                                './verify-account/verify-account.component'
                            ).then((m) => m.VerifyAccountComponent),
                    },
                     {
                        path: "upgrade",
                        loadComponent: () =>
                            import(
                                './upgrade/upgrade.component'
                            ).then((m) => m.UpgradeComponent),
                    },
                     {
                        path: 'review-and-download',
                        loadComponent: () =>
                            import(
                                './review-and-download/review-and-download.component'
                            ).then((m) => m.ReviewAndDownloadComponent),
                    },
                ],
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
