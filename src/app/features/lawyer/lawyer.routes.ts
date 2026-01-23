import {Routes} from '@angular/router';
import {LawyerDashboardComponent} from './dashboard/lawyer-dashboard.component';
import {ProfileComponent} from './profile/profile.component';

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
                loadComponent: () =>
                    import(
                        './appointments/appointments.component'
                        ).then((m) => m.AppointmentsComponent),
                pathMatch: 'full',
            },
            {
                path: 'appointments',
                loadComponent: () =>
                    import(
                        './appointments/appointments.component'
                        ).then((m) => m.AppointmentsComponent),
                title: 'Appointments',
            },
            {
                path: 'profile',
                component: ProfileComponent,
                title: 'Profile',
            },
            {
                path: "appointments",
                loadComponent: () =>
                    import(
                        './appointments/appointments.component'
                        ).then((m) => m.AppointmentsComponent),
            }
        ],
    },
];
