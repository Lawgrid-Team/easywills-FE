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
                        path: "asset-inventory",
                        loadComponent: () =>
                            import(
                                './asset-inventory/asset-inventory.component'
                            ).then((m) => m.AssetInventoryComponent),
                    },
                    {
                        path: "estate-distribution",
                        loadComponent: () =>
                            import(
                                './estate-distribution/estate-distribution.component'
                            ).then((m) => m.EstateDistributionComponent),
                    },
                    {
                        path: "executor-and-witnesses",
                        loadComponent: () =>
                            import(
                                './executor-and-witnesses/executor-and-witnesses.component'
                            ).then((m) => m.ExecutorAndWitnessesComponent),
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
