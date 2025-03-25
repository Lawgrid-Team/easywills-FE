import { Routes } from '@angular/router';
import { WizardComponent } from './wizard.component';


export const routes: Routes = [
    {
        path:'',
        component: WizardComponent,
        children: [
            {
                path:'',
                redirectTo: 'wizard',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
