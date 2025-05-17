import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/auth/feature/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/feature/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {   
        path: 'city-guardian',
        //canActivate: [sessionGuard],
        loadComponent: () => import('./shared/layout/base/layout.component').then(m => m.LayoutComponent),
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
          },
          {
            path: '**',
            redirectTo: 'dashboard',
          },
        ],
      },




    {
        path: '**',
        redirectTo: 'auth',
    },
];
