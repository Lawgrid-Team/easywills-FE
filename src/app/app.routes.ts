import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.routes),
    },
    {
        path: 'wizard',
        loadChildren: () =>
            import('./features/wizard/wizard.routes').then((m) => m.routes),
    },
    {
        path: '',
        loadChildren: () =>
            import('./features/web/web.routes').then((m) => m.routes),
    },
    {
        path: '**',
        redirectTo: '',
    },
] as Routes;
