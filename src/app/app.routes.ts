import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/web/web.routes').then((routes) => routes.routes),
        pathMatch: 'full',
    },
    // {
    //     path: 'auth',
    //     loadChildren: () =>
    //         import('./features/auth/auth.routes').then((routes) => routes.routes),
    //     pathMatch: 'full',
    // },

    // {
    //     path: 'auth',
    //     loadChildren: () => import('./features/auth/auth.routes'),
    //     pathMatch: 'full',
    // },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./features/auth/signup/signup.component').then(
                (m) => m.SignupComponent
            ),
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import(
                './features/auth/forgot-password/forgot-password.component'
            ).then((m) => m.ForgotPasswordComponent),
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import(
                './features/auth/reset-password/reset-password.component'
            ).then((m) => m.ResetPasswordComponent),
    },
    //   {
    //     path: 'about',
    //     loadComponent: () =>
    //       import('./features/web/pages/about/about.component').then(
    //         (m) => m.AboutComponent
    //       ),
    //   },
    //   {
    //     path: 'help',
    //     loadComponent: () =>
    //       import('./features/web/pages/help-centre/help-centre.component').then(
    //         (m) => m.HelpCentreComponent
    //       ),
    //   },
    //   {
    //     path: 'pricing',
    //     loadComponent: () =>
    //       import('./features/web/pages/pricing/pricing.component').then(
    //         (c) => c.PricingComponent
    //       ),
    //   },
    {
        path: '**',
        redirectTo: '',
    },
];
