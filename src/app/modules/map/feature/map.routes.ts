import { Routes } from '@angular/router';

export const MAP_ROUTES: Routes = [

    {
        path:'index',
        loadComponent: () => import('./map-index/map-index.component').then(m => m.MapIndexComponent),
    },
    {
        path:'**',
        redirectTo: 'index',
        
    }
];
