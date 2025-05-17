import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [

    {
        path:'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    },
    {
        path:'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    },
    {
        path:'verification',
        loadComponent: () => import('./code-verification/code-verification.component').then(m => m.CodeVerificationComponent),
    },
    {
        path:'reset-password',
        loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    },
    {
        path:'account-activation',
        loadComponent: () => import('./account-activation/account-activation.component').then(m => m.AccountActivationComponent),
    },
    {
        path:'**',
        redirectTo: 'login',
        
    }
];
