import { Routes } from '@angular/router';
import { LawyerLoginComponent } from './login/lawyer-login.component';

export const lawyerRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LawyerLoginComponent,
        title: 'Lawyer Login',
    },
    // Dashboard route will be added later
    // {
    //     path: 'dashboard',
    //     component: LawyerDashboardComponent,
    //     title: 'Lawyer Dashboard'
    // }
];
