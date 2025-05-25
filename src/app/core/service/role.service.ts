import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'ADMIN' | 'CLIENT';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentRoleSubject = new BehaviorSubject<UserRole | null>(null);
  public currentRole$ = this.currentRoleSubject.asObservable();

  // Definición de permisos por rol
  private rolePermissions = {
    ADMIN: {
      canViewDashboard: true,
      canManageUsers: true,
      canViewReports: true,
      canManageReports: true,
      canViewMap: true,
      canManageMap: true,
      canViewProfile: true,
      canEditProfile: true,
      canViewStatistics: true,
      canExportData: true,
      canViewCategories: true,
      canCreateReports: false,
    },
    CLIENT: {
      canViewDashboard: true,
      canManageUsers: false,
      canViewReports: true,
      canManageReports: false,
      canViewMap: true,
      canManageMap: false,
      canViewProfile: true,
      canEditProfile: true,
      canViewStatistics: false,
      canExportData: false,
      canViewCategories: false,
      canCreateReports: true
    }
  };

  constructor() {
    // Intentar recuperar el rol del localStorage al iniciar
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      this.setRole(savedRole as UserRole);
    }
  }

  setRole(role: UserRole): void {
    this.currentRoleSubject.next(role);
    localStorage.setItem('userRole', role);
  }

  getCurrentRole(): UserRole | null {
    return this.currentRoleSubject.value;
  }

  hasPermission(permission: keyof typeof this.rolePermissions.ADMIN): boolean {
    const currentRole = this.getCurrentRole();
    if (!currentRole) return false;
    return this.rolePermissions[currentRole][permission] || false;
  }

  clearRole(): void {
    this.currentRoleSubject.next(null);
    localStorage.removeItem('userRole');
  }

  // Métodos de utilidad para verificar permisos específicos
  canManageUsers(): boolean {
    return this.hasPermission('canManageUsers');
  }

  canViewReports(): boolean {
    return this.hasPermission('canViewReports');
  }

  canManageReports(): boolean {
    return this.hasPermission('canManageReports');
  }

  canViewMap(): boolean {
    return this.hasPermission('canViewMap');
  }

  canManageMap(): boolean {
    return this.hasPermission('canManageMap');
  }

  canViewStatistics(): boolean {
    return this.hasPermission('canViewStatistics');
  }

  canExportData(): boolean {
    return this.hasPermission('canExportData');
  }

  canViewCategories(): boolean {
    return this.hasPermission('canViewCategories');
  }

  canCreateReports(): boolean {
    return this.hasPermission('canCreateReports');
  }
} 