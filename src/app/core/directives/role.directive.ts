import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { RoleService, UserRole } from '../service/role.service';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective implements OnInit {
  private hasView = false;
  private roles: UserRole[] = [];

  @Input() set appRole(roles: UserRole | UserRole[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.roleService.currentRole$.subscribe(() => {
      this.updateView();
    });
  }

  private updateView() {
    const currentRole = this.roleService.getCurrentRole();
    const hasRole = currentRole && this.roles.includes(currentRole);

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
} 