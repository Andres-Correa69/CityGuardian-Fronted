import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/auth/feature/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/feature/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
