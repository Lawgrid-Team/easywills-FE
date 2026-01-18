import { Routes } from '@angular/router';
import { LawyerLoginComponent } from './login/lawyer-login.component';
import { LawyerDashboardComponent } from './dashboard/lawyer-dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ProfileComponent } from './profile/profile.component';

export const lawyerRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    // {
    //     path: 'login',
    //     component: LawyerLoginComponent,
    //     title: 'Lawyer Login',
    // },
    {
        path: 'dashboard',
        component: LawyerDashboardComponent,
        title: 'Lawyer Dashboard',
        children: [
            {
                path: '',
                redirectTo: 'appointments',
                pathMatch: 'full',
            },
            {
                path: 'appointments',
                component: AppointmentsComponent,
                title: 'Appointments',
            },
            {
                path: 'profile',
                component: ProfileComponent,
                title: 'Profile',
            },
        ],
    },
];
