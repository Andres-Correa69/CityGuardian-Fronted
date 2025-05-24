import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { RoleDirective } from './app/core/directives/role.directive';
import { PermissionDirective } from './app/core/directives/permission.directive';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    RoleDirective,
    PermissionDirective
  ]
}).catch(err => console.error(err));
