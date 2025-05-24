import { Routes } from '@angular/router';

export const CATEGORY_ROUTES: Routes = [

    {
        path:'index',
        loadComponent: () => import('./index-category/index-category.component').then(m => m.IndexCategoryComponent),
    },
    {
        path:'**',
        redirectTo: 'index',
        
    }
];
