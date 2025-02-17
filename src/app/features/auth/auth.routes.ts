// import { Routes } from '@angular/router';
// import { AuthComponent } from './auth.component';

// export const routes: Routes = [
//     {
//         path: '',
//         component: AuthComponent,
//         children: [
//             {
//                 path: '',
//                 redirectTo: 'login',
//                 pathMatch: 'full',
//             },
//             {
//                 path: 'login',
//                 loadComponent: () =>
//                     import('./login/login.component').then(
//                         (m) => m.LoginComponent
//                     ),
//             },
//             {
//                 path: 'signup',
//                 loadComponent: () =>
//                     import('./signup/signup.component').then(
//                         (m) => m.SignupComponent
//                     ),
//             },
//             {
//                 path: 'forgot-password',
//                 loadComponent: () =>
//                     import('./forgot-password/forgot-password.component').then(
//                         (m) => m.ForgotPasswordComponent
//                     ),
//             },
//             {
//                 path: 'reset-password',
//                 loadComponent: () =>
//                     import('./reset-password/reset-password.component').then(
//                         (m) => m.ResetPasswordComponent
//                     ),
//             },
//             {
//                 path: '**',
//                 redirectTo: '',
//             },
//         ],
//     },
// ] as Routes;
