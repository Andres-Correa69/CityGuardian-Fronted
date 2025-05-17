import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [

    {
        path:'index',
        loadComponent: () => import('./report-index/report-index.component').then(m => m.ReportIndexComponent),
    },
    {
        path:'**',
        redirectTo: 'index',
        
    }
];
