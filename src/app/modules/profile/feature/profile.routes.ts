import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [

    {
        path: 'index',
        loadComponent: () => import('./index-profile/index-profile.component').then(m => m.IndexProfileComponent),
    },
    {
        path: '**',
        redirectTo: 'index',

    }
];
