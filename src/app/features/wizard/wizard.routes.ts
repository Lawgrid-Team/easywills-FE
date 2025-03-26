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
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
