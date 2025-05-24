import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDirective } from '../../core/directives/role.directive';
import { PermissionDirective } from '../../core/directives/permission.directive';
import { RoleService, UserRole } from '../../core/service/role.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RoleDirective,
    PermissionDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentRole: UserRole | null = null;

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    // Suscribirse a cambios en el rol
    this.roleService.currentRole$.subscribe(role => {
      this.currentRole = role;
    });
  }

  verMas() {
    // Aquí puedes implementar la lógica para mostrar más detalles
    console.log('Mostrando más detalles...');
  }

  gestionarReportes() {
    // Aquí puedes implementar la lógica para gestionar reportes
    console.log('Gestionando reportes...');
  }
}
