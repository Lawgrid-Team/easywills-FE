import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.routes),
    },
    {
        path: 'wiz',
        //canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/wizard/wizard.routes').then((m) => m.routes),
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./features/dashboard/dashboard.routes').then(
                (m) => m.routes
            ),
    },
    {
        path: 'view-will',
        loadComponent: () =>
            import('./features/dashboard/view-will/view-will.component').then(
                (m) => m.ViewWillComponent
            ),
    },
    {
        path: 'create-codicil',
        loadComponent: () =>
            import(
                './features/dashboard/create-codicil/create-codicil.component'
            ).then((m) => m.CreateCodicilComponent),
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
