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
            path: 'profile',
            loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent),
          },
          {
            path: 'map',
            loadChildren: () => import('./modules/map/feature/map.routes').then(m => m.MAP_ROUTES),
          },
          {
            path: 'report',
            loadChildren: () => import('./modules/report/feature/report.routes').then(m => m.REPORT_ROUTES),
          },
          {
            path: 'category',
            loadChildren: () => import('./modules/category/feature/category.routes').then(m => m.CATEGORY_ROUTES),
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
